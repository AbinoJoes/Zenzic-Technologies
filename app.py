
import os
import re
import smtplib
import mysql.connector
from email.message import EmailMessage

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

from db import create_table, get_db_connection

load_dotenv()

app = Flask(__name__)

ALLOWED_SERVICES = {
    "Web Development",
    "Software Development",
    "Mobile App Development",
    "UI UX Design",
    "Digital Transformation",
    "IT Consulting",
    "Other",
}

ALLOWED_BUDGETS = {
    "",
    "Under ₹25,000",
    "₹25,000 – ₹50,000",
    "₹50,000 – ₹1,00,000",
    "Above ₹1,00,000",
    "To be discussed",
}


def send_email_notification(data):
    company_email = os.getenv("COMPANY_EMAIL")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    if not all([company_email, smtp_user, smtp_password]):
        raise RuntimeError("Email configuration is missing.")

    email_message = EmailMessage()
    email_message["Subject"] = (
        f"New website enquiry: {data['service']}"
    )
    email_message["From"] = smtp_user
    email_message["To"] = company_email
    email_message["Reply-To"] = data["email"]

    email_message.set_content(f"""
New SPAIT INFOTECH website enquiry

Name: {data['fullName']}
Company: {data['companyName'] or 'Not provided'}
Email: {data['email']}
Phone: {data['phone'] or 'Not provided'}
Service: {data['service']}
Budget: {data['budget'] or 'Not provided'}

Message:
{data['message']}
""")

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(email_message)


@app.get("/contact")
def home():
    return render_template("contact.html")


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify(
            success=False,
            message="Invalid request."
        ), 400

    full_name = str(data.get("fullName") or "").strip()
    company_name = str(data.get("companyName") or "").strip()
    email = str(data.get("email") or "").strip()
    phone = str(data.get("phone") or "").strip()
    service = str(data.get("service") or "").strip()
    budget = str(data.get("budget") or "").strip()
    message = str(data.get("message") or "").strip()
    consent = data.get("consent") is True

    if not full_name or not email or not service or not message:
        return jsonify(
            success=False,
            message="Please complete all required fields."
        ), 400

    if len(full_name) > 150 or len(company_name) > 150:
        return jsonify(
            success=False,
            message="Name or company name is too long."
        ), 400

    if len(email) > 254 or not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+", email
    ):
        return jsonify(
            success=False,
            message="Enter a valid email address."
        ), 400

    if len(phone) > 30 or len(message) > 10000:
        return jsonify(
            success=False,
            message="Phone number or message is too long."
        ), 400

    if service not in ALLOWED_SERVICES:
        return jsonify(
            success=False,
            message="Please select a valid service."
        ), 400

    if budget not in ALLOWED_BUDGETS:
        return jsonify(
            success=False,
            message="Please select a valid budget."
        ), 400

    if not consent:
        return jsonify(
            success=False,
            message="Please agree to be contacted."
        ), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO enquiries (
                full_name, company_name, email, phone,
                service, budget, message
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                full_name,
                company_name or None,
                email,
                phone or None,
                service,
                budget or None,
                message,
            ),
        )

        connection.commit()

    except Exception:
        app.logger.exception("Failed to save enquiry.")

        if connection and connection.is_connected():
            connection.rollback()

        return jsonify(
            success=False,
            message="Could not save your enquiry. Please try again."
        ), 500

    finally:
        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()

    # Save first; email is a separate operation.
    try:
        send_email_notification({
            "fullName": full_name,
            "companyName": company_name,
            "email": email,
            "phone": phone,
            "service": service,
            "budget": budget,
            "message": message,
        })
    except Exception:
        app.logger.exception(
            "Enquiry saved, but email notification failed."
        )

    return jsonify(
        success=True,
        message="Thank you! Your enquiry has been received."
    ), 201


if __name__ == "__main__":
    create_table()
    app.run(debug=True, port=5000)

