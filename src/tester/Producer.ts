import kafka from "../core/interface/kafka";

const producer = kafka.producer();

export const run = async () => {
  await producer.connect();

  await setInterval(() => {
    const date = new Date().toLocaleTimeString();
    const randomNumber = Math.random();

    producer
      .send({
        topic: "azuki.dp.action.test",
        messages: [
          {
            value: `[홍어툴 - 홍어가 감지되었습니다!] Hello 전라도 Ray! 받아라 홍어 D-DOS 어택! ${randomNumber} ${date} Made by. 흑산도홍어 양.석.준\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지\nWarning 홍어 감지`,
          },
        ],
      })
      .then((res) => {
        console.log(`[Producer] ${date} ${randomNumber}`);
      });
  }, 50);
};
