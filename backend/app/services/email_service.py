import smtplib
from email.message import EmailMessage

from app.core.config import settings


class EmailService:
    def __init__(self):
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.username = settings.SMTP_USERNAME
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL

    def send_email(
        self,
        *,
        to_email: str,
        subject: str,
        html: str,
    ) -> None:

        message = EmailMessage()

        message["Subject"] = subject
        message["From"] = self.from_email
        message["To"] = to_email

        message.set_content(
            "Please use an HTML compatible email client."
        )

        message.add_alternative(
            html,
            subtype="html",
        )

        with smtplib.SMTP(
            self.host,
            self.port,
        ) as smtp:

            smtp.starttls()

            smtp.login(
                self.username,
                self.password,
            )

            smtp.send_message(
                message,
            )

    def send_verification_email(
        self,
        *,
        email: str,
        username: str,
        verification_url: str,
    ) -> None:

        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Welcome {username}!</h2>

                <p>
                    Thank you for registering.
                </p>

                <p>
                    Please verify your email by clicking the button below.
                </p>

                <p>
                    <a
                        href="{verification_url}"
                        style="
                            background:#2563eb;
                            color:white;
                            padding:12px 20px;
                            text-decoration:none;
                            border-radius:6px;
                            display:inline-block;
                        "
                    >
                        Verify Email
                    </a>
                </p>

                <p>
                    If you didn't create this account,
                    you can safely ignore this email.
                </p>
            </body>
        </html>
        """

        self.send_email(
            to_email=email,
            subject="Verify your email",
            html=html,
        )
    def send_password_reset_email(
        self,
        email: str,
        username: str,
        reset_url: str,
    ) -> None:

        subject = "Reset Your Password"

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset</h2>

            <p>Hello <b>{username}</b>,</p>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                Click the button below to create a new password.
            </p>

            <p>
                <a
                    href="{reset_url}"
                    style="
                        background:#2563eb;
                        color:white;
                        padding:12px 24px;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>
            </p>

            <p>
                This link expires in 1 hour.
            </p>

            <p>
                If you didn't request this, you can safely ignore this email.
            </p>
        </body>
        </html>
        """

        self.send_email(
            to_email=email,
            subject=subject,
            html=html,
        )