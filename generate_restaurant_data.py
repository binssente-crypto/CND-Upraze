import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Settings
num_days = 90
start_date = datetime.now() - timedelta(days=num_days)

items = [
    {'name': 'Wagyu Burger', 'cat': 'Main Course', 'cost': 150, 'price': 450},
    {'name': 'Truffle Pasta', 'cat': 'Main Course', 'cost': 120, 'price': 380},
    {'name': 'Craft Beer', 'cat': 'Beverage', 'cost': 45, 'price': 180},
    {'name': 'Caesar Salad', 'cat': 'Appetizer', 'cost': 60, 'price': 250},
    {'name': 'Red Wine (Glass)', 'cat': 'Beverage', 'cost': 80, 'price': 320},
]

rows = []

for i in range(num_days):
    current_date = start_date + timedelta(days=i)
    # Weekend multiplier (Friday, Saturday, Sunday)
    multiplier = 1.8 if current_date.weekday() >= 4 else 1.0
    
    for item in items:
        # Generate random usage/sales
        base_qty = np.random.randint(15, 40)
        units_sold = int(base_qty * multiplier)
        waste_qty = np.random.randint(0, 5)
        
        revenue = units_sold * item['price']
        total_cost = (units_sold + waste_qty) * item['cost']
        
        rows.append({
            'Date': current_date.strftime('%Y-%m-%d'),
            'Item_Name': item['name'],
            'Category': item['cat'],
            'Units_Sold': units_sold,
            'Unit_Cost': item['cost'],
            'Sales_Price': item['price'],
            'Waste_Qty': waste_qty,
            'Daily_Revenue': revenue,
            'Daily_Cost': total_cost,
            'Net_Profit': revenue - total_cost
        })

df = pd.DataFrame(rows)

# Save files
df.to_csv('restaurant_business_data.csv', index=False)
df.to_excel('restaurant_business_data.xlsx', index=False)

print("Restaurant sample files generated: restaurant_business_data.csv/xlsx")
