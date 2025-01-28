import pandas as pd
import numpy as np
import streamlit as st
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

data = pd.read_csv("housing.csv")
data.dropna(inplace=True)
x = data.drop(["median_house_value"], axis=1)
y = data['median_house_value']

x['total_rooms'] = np.log(x['total_rooms'] + 1)
x['total_bedrooms'] = np.log(x['total_bedrooms'] + 1)
x['population'] = np.log(x['population'] + 1)
x['households'] = np.log(x['households'] + 1)
x = pd.get_dummies(x, drop_first=True)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

scaler = StandardScaler()
x_train_s = scaler.fit_transform(x_train)
x_test_s = scaler.transform(x_test)

forest = RandomForestRegressor(n_estimators=100, random_state=42)
forest.fit(x_train_s, y_train)

y_pred_train = forest.predict(x_train_s)
y_pred_test = forest.predict(x_test_s)

# Calculate RMSE and MAE
train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)

# Feature importance
feature_importance = pd.DataFrame({
    'Feature': x.columns,
    'Importance': forest.feature_importances_
}).sort_values(by='Importance', ascending=False)

# Preprocess function to handle user input
def preprocess_input(input_data):
    # Log transformation (same as your training data)
    input_data['total_rooms'] = np.log(input_data['total_rooms'] + 1)
    input_data['total_bedrooms'] = np.log(input_data['total_bedrooms'] + 1)
    input_data['population'] = np.log(input_data['population'] + 1)
    input_data['households'] = np.log(input_data['households'] + 1)
    
    # One-hot encoding for categorical variable (e.g., ocean_proximity)
    input_data = pd.get_dummies(input_data, drop_first=True)
    
    # Ensure the same columns as in the training data
    missing_cols = set(x_train.columns) - set(input_data.columns)
    for col in missing_cols:
        input_data[col] = 0  # Add missing columns with 0 values
    input_data = input_data[x_train.columns]  # Reorder columns to match training data
    
    # Return the preprocessed input data
    return input_data


st.title("House Price Prediction Dashboard")

st.subheader("Dataset Insights")
st.write("Summary statistics of the data:")
st.write(data.describe())

st.subheader("Correlation Heatmap (Numeric Features Only)")
correlation = data.select_dtypes(include=[np.number]).corr()
plt.figure(figsize=(12, 8))
sns.heatmap(correlation, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
st.pyplot(plt)

st.subheader("Feature Importance")
plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=feature_importance)
st.pyplot(plt)

st.subheader("Model Performance Metrics")
st.write(f"Training RMSE: {train_rmse:.2f}")
st.write(f"Test RMSE: {test_rmse:.2f}")
st.write(f"Training MAE: {train_mae:.2f}")
st.write(f"Test MAE: {test_mae:.2f}")

longitude = st.number_input("Longitude", value=-118.25)
latitude = st.number_input("Latitude", value=34.05)
total_rooms = st.number_input("Total Rooms", value=2000)
total_bedrooms = st.number_input("Total Bedrooms", value=500)
population = st.number_input("Population", value=1000)
households = st.number_input("Households", value=400)
ocean_proximity = st.selectbox("Ocean Proximity", ['<1H OCEAN', 'INLAND', 'NEAR BAY', 'NEAR OCEAN', 'ISLAND'])

user_input = pd.DataFrame({
    'longitude': [longitude],
    'latitude': [latitude],
    'total_rooms': [total_rooms],
    'total_bedrooms': [total_bedrooms],
    'population': [population],
    'households': [households],
    'ocean_proximity': [ocean_proximity]
})

user_input_preprocessed = preprocess_input(user_input)

user_input_scaled = scaler.transform(user_input_preprocessed)

predicted_price = forest.predict(user_input_scaled)

st.write(f"Predicted House Price: ${predicted_price[0]:,.2f}")

st.subheader("Predicted vs Actual House Prices")
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred_test, alpha=0.5)
plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], '--r', label='Perfect prediction')
plt.title("Predicted vs Actual House Prices")
plt.xlabel("Actual Prices")
plt.ylabel("Predicted Prices")
plt.legend()
st.pyplot(plt)
