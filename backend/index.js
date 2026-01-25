const express = require("express");

const app = express();
const PORT = 3000;


/* -------- MOCK EXTERNAL SERVICES -------- */

async function getOrderDetails(orderId) {
    return ["Burger", "Fries", "Coke"];
}

async function getImageAnalysis(orderId) {
    return ["Burger", "Fries"];
}


/* -------- CORE COMPARISON LOGIC -------- */

function compareItems(orderList, detectedList) {
    const orderSet = new Set(orderList);
    const detectedSet = new Set(detectedList);

    const missing = [...orderSet].filter(i => !detectedSet.has(i));
    const extra = [...detectedSet].filter(i => !orderSet.has(i));

    return {
        is_match: missing.length === 0 && extra.length === 0,
        missing_items: missing,
        extra_items: extra
    };
}


/* -------- API -------- */

app.get("/process-order/:orderId", async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const [orderList, detectedList] = await Promise.all([
            getOrderDetails(orderId),
            getImageAnalysis(orderId)
        ]);

        const result = compareItems(orderList, detectedList);

        const status = result.is_match ? "Accepted" : "Action Required";
        const message = result.is_match
            ? "Order verified. Ready to pack."
            : `Alert: Order ${orderId} is incomplete. Missing: ${result.missing_items.join(", ")}`;

        res.json({
            order_id: orderId,
            status,
            message,
            details: result
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* -------- START -------- */

app.listen(PORT, () => {
    console.log(` Backend running → http://localhost:${PORT}`);
});
