import express from 'express';
import cors from 'cors';
import { translate } from '@vitalets/google-translate-api';

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", function(req, res) {
    res.send("API running...");
});

app.get("/api/translator", async function(req, res) {
    const keywords = req.query.keywords;
    const input = req.query.input;
    const output = req.query.output;

    if (keywords && input && output) {
        const result = await translate(keywords, { from: input, to: output });

        console.log(result);
        if (result.text && result.text.length > 0) 
            return res.status(200).json(result);
        return res.status(401).json({ message: "Failed" });    
    }
});

app.listen(4000, function () {
    console.log("Success running on port 4000");
});