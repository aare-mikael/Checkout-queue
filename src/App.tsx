import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const generateRandomQueue = () => {
    return Array.from({ length: 5 }, () =>
      Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => Math.floor(Math.random() * 10) + 1
      )
    );
  };

  const [itemsInCart, setItemsInCart] = useState<number>(0);
  const [queues, setQueues] = useState(generateRandomQueue());
  const [newItem, setnewItem] = useState<number | null>(null);

  function addNewPersonToQueue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (itemsInCart === undefined || itemsInCart <= 0) return;

    let leastItemsAmount = 1e9; // 1e9 = 1 billion items
    let shortestQueue: number[] | undefined = undefined;

    for (let queue of queues) {
      const itemsInQueue = queue.reduce((sum, value) => sum + value, 0);
      if (itemsInQueue < leastItemsAmount) {
        shortestQueue = queue;
        leastItemsAmount = itemsInQueue;
      }
    }

    if (!shortestQueue) return;
    setQueues((prevQueues) =>
      prevQueues.map((queue) =>
        queue === shortestQueue ? [...queue, itemsInCart] : queue
      )
    );
    setnewItem(itemsInCart);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setQueues((prevQueues) =>
        prevQueues.map((queue) => {
          if (queue.length === 0) return queue;
          const newQueue = [...queue];
          const firstItem = newQueue[0];
          if (firstItem > 1) {
            newQueue[0] = firstItem - 1;
          } else {
            newQueue.shift();
          }
          setnewItem(null);
          return newQueue;
        })
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <main>
        <header className="header">
          <h1>Checkout Queue Project</h1>
          <p>
            React practice project. This will simulate 5 checkout stations, with
            5 corresponding queues. In your input box, enter the amount of items
            you have in your shopping cart, and then you'll be put in the
            shortest queue. Every 2 seconds, one item will be removed from each
            queue. When you are at the front of the queue and "lose" your last
            item, you will be removed from the queue.
          </p>
          <div className="form">
            <form onSubmit={addNewPersonToQueue}>
              <label htmlFor="items">Items:</label>
              <input
                required
                type="number"
                value={itemsInCart}
                onChange={(e) => setItemsInCart(e.currentTarget.valueAsNumber)}
              />
              <button type="submit">Find shortest queue</button>
            </form>
          </div>
        </header>
        <body>
          <div className="queues">
            {queues.map((queue, idx) => (
              <div className="queue" key={idx}>
                <p>Queue {idx + 1}</p>
                <div className="queue-items">
                  {queue.map((numberOfItems, lineIdx) => (
                    <div
                      className={`queue-item ${
                        numberOfItems === 1 && lineIdx === 0 ? "last-item" : ""
                      } ${
                        newItem === numberOfItems &&
                        lineIdx === queue.length - 1
                          ? "new-item"
                          : ""
                      }`}
                      key={lineIdx}
                    >
                      {numberOfItems}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </body>
      </main>
    </div>
  );
}

export default App;
