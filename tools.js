// Simplifies getting data from DB in routing
async function getTool(res, fetchExpr) {
    try {
        const content = await fetchExpr;
        res.json(content);
    }
    catch(err) {
        res.json({message: err});
    }
}