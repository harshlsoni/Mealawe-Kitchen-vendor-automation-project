from fastapi import FastAPI, HTTPException
import httpx
import asyncio

app = FastAPI()

# --- MOCK EXTERNAL SERVICES ---
async def get_order_details(order_id: str):
    # This simulates your first API call
    # In reality: return httpx.get(f"https://api.orders.com/{order_id}").json()
    return ["Burger", "Fries", "Coke"]

async def get_image_analysis(order_id: str):
    # This simulates fetching the image and the CV model processing it
    # For now, let's simulate a 'misplaced' item by missing the "Coke"
    return ["Burger", "Fries"] 

# --- CORE COMPARISON LOGIC ---
def compare_items(order_list, detected_list):
    order_set = set(order_list)
    detected_set = set(detected_list)
    
    missing = list(order_set - detected_set)
    extra = list(detected_set - order_set)
    
    return {
        "is_match": len(missing) == 0 and len(extra) == 0,
        "missing_items": missing,
        "extra_items": extra
    }

@app.get("/process-order/{order_id}")
async def process_order(order_id: str):
    # 1. Fetch from both sources concurrently to save time
    order_task = get_order_details(order_id)
    cv_task = get_image_analysis(order_id)
    
    order_list, detected_list = await asyncio.gather(order_task, cv_task)
    
    # 2. Run the comparison
    result = compare_items(order_list, detected_list)
    
    # 3. Formulate the alert message
    if not result["is_match"]:
        msg = f"Alert: Order {order_id} is incomplete. Missing: {', '.join(result['missing_items'])}"
        status = "Action Required"
    else:
        msg = "Order verified. Ready to pack."
        status = "Accepted"

    return {
        "order_id": order_id,
        "status": status,
        "message": msg,
        "details": result
    }