import express from "express"
import {exec} from "child_process";

const app = express();
const port = 3100; // Укажите порт, который будет слушать ваш сервер

const router = express.Router()

app.use(express.json());
app.use("/pull", router)

app.post('/ksu-helper', (req, res) => {
    // Выполните необходимые команды для обновления и перезапуска приложения
    exec('cd /var/www/ksu-helper/ && git pull origin main', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error during deployment');
        }

        exec('pm2 restart ksu-helper', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error during restart');
            }

            console.log('Deployment and restart successful');
            res.status(200).send('Deployment successful');
        });
    });
});

app.listen(port, () => {
    console.log(`Webhook handler listening at http://localhost:${port}`);
});
