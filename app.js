import express from "express"
import {exec} from "child_process";
import log from "./logging/logging.js"

const app = express();
const port = 3100; // Укажите порт, который будет слушать ваш сервер

const router = express.Router()

app.use(express.json());
app.use("/pull", router)

router.post('/ksu-helper', (req, res) => {
    // Выполните необходимые команды для обновления и перезапуска приложения
    exec('cd /var/www/ksu-helper/ && git pull origin main', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            log.error("Ошибка при деплое ksu-helper." + err)

            return res.status(500).send('Error during deployment');
        }

        exec('pm2 restart ksu-helper', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                log.error("Ошибка при рестарте ksu-helper." + err)
                return res.status(500).send('Error during restart');
            }

            console.log('Deployment and restart successful');
            log.warn("Деплой и рестарт ksu-helper успешно выполнен.")
            res.status(200).send('Deployment successful');
        });
    });
});

app.listen(port, () => {
    log.info("Git puller успешно запущен!")
    console.log(`Git_Puller's Webhook handler listening at http://localhost:${port}`);
});
