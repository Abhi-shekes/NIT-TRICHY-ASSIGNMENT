import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email_alert(subject, body, recipient_email):
    sender_email = "abhishekshivtiwari@gmail.com"  
    sender_password = "pymgdnifqnynggnb" 

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        st.success("🚨 Email alert sent successfully!")
    except Exception as e:
        st.error(f"Error sending email: {str(e)}")
