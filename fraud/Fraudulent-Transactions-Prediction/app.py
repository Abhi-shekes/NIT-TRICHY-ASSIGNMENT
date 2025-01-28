import streamlit as st
import pandas as pd
import numpy as np
import pickle
from alert import send_email_alert
model = pickle.load(open('model.sav', 'rb'))
scaler = pickle.load(open('scaler.sav', 'rb'))

def preprocess_data(data):
    feature_names = ['step', 'type', 'amount', 'oldbalanceOrg', 'oldbalanceDest', 'isFlaggedFraud']
    
    data['type'] = data['type'].map({'CASH_OUT': 5, 'PAYMENT': 4, 'CASH_IN': 3, 'TRANSFER': 2, 'DEBIT': 1})
    
    data_scaled = scaler.transform(data[feature_names])
    
    return data_scaled

def main():
    st.set_page_config(page_title="Fraud Detection App", page_icon="💳", layout="centered")

    st.markdown("""
        <style>
            .main {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
            }
            h1, h2, h3 {
                text-align: center;
                color: #333;
            }
            .stButton button {
                background-color: #2b6cb0;
                color: white;
                border-radius: 10px;
                width: 100%;
                font-size: 16px;
                padding: 10px;
            }
            .stButton button:hover {
                background-color: #1e4b7a;
            }
        </style>
    """, unsafe_allow_html=True)

    # App title and description
    st.title("💳 Fraud Transaction Detection App")
    st.markdown("This app helps you predict whether a financial transaction is fraudulent or not based on transaction details.")

    col1, col2 = st.columns(2)

    with col1:
        step = st.number_input("Transaction Step (Time)", min_value=1)
        type_val = st.selectbox("Transaction Type", ['CASH_OUT', 'PAYMENT', 'CASH_IN', 'TRANSFER', 'DEBIT'])
        isFlaggedFraud = st.checkbox("Is the transaction flagged as fraud?")

    with col2:
        amount = st.number_input("Transaction Amount", min_value=0.0, format="%f")
        oldbalanceOrg = st.number_input("Old Balance of Origin Account", min_value=0.0, format="%f")
        oldbalanceDest = st.number_input("Old Balance of Destination Account", min_value=0.0, format="%f")

    if st.button("Submit Transaction Details"):
        user_data = pd.DataFrame({
            'step': [step],
            'type': [type_val],
            'amount': [amount],
            'oldbalanceOrg': [oldbalanceOrg],
            'oldbalanceDest': [oldbalanceDest],
            'isFlaggedFraud': [isFlaggedFraud]
        })

        user_data_scaled = preprocess_data(user_data)

        prediction = model.predict(user_data_scaled)

        st.header("Prediction Result:")
        if prediction[0] == 1:
            st.error("🚨 This transaction is predicted to be **Fraudulent**!")
            subject = "Fraudulent Transaction Alert"
            body = f"Attention! A fraudulent transaction has been detected.\n\nDetails:\nTransaction Step: {step}\nTransaction Type: {type_val}\nAmount: {amount}\nOld Balance of Origin: {oldbalanceOrg}\nOld Balance of Destination: {oldbalanceDest}"
            recipient_email = "abhishekshivtiwari@gmail.com" 
            send_email_alert(subject, body, recipient_email)
        else:
            st.success("✅ This transaction is predicted to be **Not Fraudulent**.")

        st.write("")

if __name__ == '__main__':
    main()
