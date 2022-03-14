---
title: scheduler
date: 2022-03-08 19:12:10
tags:
category:
  - post
---

内容

```javascript preview getCurrentTime
const getCurrentTime = () => performance.now();

define("getCurrentTime", getCurrentTime);
```

```javascript preview sleep
const getCurrentTime = require("getCurrentTime");
const sleep = (tm) => {
  let startTime = getCurrentTime();

  while (getCurrentTime() - startTime <= tm) {
    // sleep
  }
};
define("sleep", sleep);
```

```javascript preview TaskQueue
class TaskQueue {
  constructor() {
    this.queue = [];
  }
  push(task) {
    this.queue.unshift(task);
  }
  peek() {
    return this.queue[this.queue.length - 1];
  }
  pop() {
    return this.queue.pop();
  }
}
define("TaskQueue", TaskQueue);
```

```javascript preview Scheduler
const getCurrentTime = require("getCurrentTime");
const TaskQueue = require("TaskQueue");
const frameInterval = 1000 / 60;

class Scheduler {
  constructor() {
    this.taskQueue = new TaskQueue();
    this.taskIdCounter = 0;

    //
    this.isHostCallbackScheduled = false;
    this.isPerformingWork = false;

    this.startTime = -1;

    this.scheduledHostCallback = null;

    this.isMessageLoopRunning = false;

    this.cannel = new MessageChannel();

    this.cannel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }

  commitTask(callback) {
    let currentTime = getCurrentTime();

    const startTime = currentTime;

    const timeout = 0; // ms

    const newTask = {
      id: this.taskIdCounter++,
      callback,
      startTime,
    };

    this.taskQueue.push(newTask);

    if (!this.isHostCallbackScheduled && !this.isPerformingWork) {
      this.isHostCallbackScheduled = true;
      this.requestHostCallback(this.flushWork);
    }
  }

  requestHostCallback(cb) {
    this.scheduledHostCallback = cb;
    if (!this.isMessageLoopRunning) {
      this.isMessageLoopRunning = true;
      this.schedulePerformWorkUntilDeadline();
    }
  }

  // 发起事件开始执行
  schedulePerformWorkUntilDeadline() {
    this.cannel.port2.postMessage(null);
  }

  flushWork() {
    this.isHostCallbackScheduled = false;
    try {
      return this.workLoop();
    } finally {
      this.currentTask = null;
      this.isPerformingWork = false;
    }
  }

  workLoop() {
    this.currentTask = this.taskQueue.peek();
    while (this.currentTask != null) {
      const shouldCallTask = this.shouldYieldToHost();
      if (shouldCallTask) {
        break;
      }
      const callback = this.currentTask.callback;
      if (typeof callback === "function") {
        const continuationCallback = callback();

        if (typeof continuationCallback === "function") {
          this.currentTask.callback = continuationCallback;
        } else {
          if (this.currentTask === this.taskQueue.peek()) {
            this.taskQueue.pop();
          }
        }
      } else {
        this.taskQueue.pop();
      }
      this.currentTask = this.taskQueue.peek();
    }
    if (this.currentTask != null) {
      return true;
    }
    return false;
  }

  performWorkUntilDeadline() {
    if (this.scheduledHostCallback !== null) {
      const currentTime = getCurrentTime();
      this.startTime = currentTime;

      let hasMoreWork = true;
      try {
        hasMoreWork = this.scheduledHostCallback();
      } finally {
        if (hasMoreWork) {
          this.schedulePerformWorkUntilDeadline();
        } else {
          this.isMessageLoopRunning = false;
          this.scheduledHostCallback = null;
        }
      }
    }
  }

  shouldYieldToHost() {
    const timeElapsed = getCurrentTime() - this.startTime;
    if (timeElapsed < frameInterval) {
      return false;
    }
    return true;
  }
}
define("scheduler", Scheduler);
```

```html preview
<script type="module">
  const Scheduler = require("scheduler");
  const sleep = require("sleep");

  const scheduler = new Scheduler();
  const runTaskButton = document.getElementById("runTask");
  const draw = document.getElementById("draw");
  runTaskButton.onclick = () => {
    console.log("提交任务");
    scheduler.commitTask(() => {
      console.log("hello world1");
      sleep(200);
      draw.innerHTML = "task1";
    });
    scheduler.commitTask(() => {
      console.log("hello world2");
      sleep(200);
      draw.innerHTML = "task2";
    });
    scheduler.commitTask(() => {
      console.log("hello world3");
      sleep(200);
      draw.innerHTML = "task3";
    });
    scheduler.commitTask(() => {
      console.log("hello world4");
      sleep(200);
      draw.innerHTML = "task4";
    });
    scheduler.commitTask(() => {
      console.log("hello world5");
      sleep(200);
      draw.innerHTML = "task5";
    });
  };
</script>
<button id="runTask">运行任务</button>
<div id="draw"></div>
```
