import pandas as pd
import numpy as np

# Create sample data
data = {
    'Date': pd.date_range(start='2026-01-01', periods=30, freq='D'),
    'Product_Category': np.random.choice(['Electronics', 'Software', 'Consulting'], 30),
    'Region': np.random.choice(['North America', 'Europe', 'Asia'], 30),
    'Units_Sold': np.random.randint(10, 500, size=30),
}

df = pd.DataFrame(data)

# Add some logic for revenue
revenue_map = {'Electronics': 300, 'Software': 150, 'Consulting': 1000}
df['Revenue'] = df['Units_Sold'] * df['Product_Category'].map(revenue_map)

# Save to CSV
df.to_csv('sample_sales_data.csv', index=False)

# Save to XLSX
df.to_excel('sample_sales_data.xlsx', index=False)

print("Sample files generated successfully.")
