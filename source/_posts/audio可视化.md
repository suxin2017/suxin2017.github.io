---
title: audio可视化
date: 2021-10-24 20:00:51
tags:
category:
- post
---
```html preview 如果没有播放点击play可视化
<div>
	<audio id="audio" controls autoplay>
		<source src="/imgs/demo.m4a" type="audio/mp4" />
	</audio>
</div>
<div style="display: flex;    flex-wrap: wrap; gap:20px">
	<div>
		<div>波形</div>
		<canvas id="canvas" width="200px" height='200px'></canvas>
	</div>
	<div>
		<div>频率</div>
		<canvas id="canvas1" width="200px" height='200px'></canvas>
	</div>
</div>

<script type="module">
	const audio = document.getElementById('audio');
	const canvas = document.getElementById("canvas");
	const canvasCtx = canvas.getContext("2d");
	const canvas1 = document.getElementById("canvas1");
	const canvas1Ctx = canvas1.getContext("2d");
	let play = false;

	audio.addEventListener('play', function () {
		play = true;
		const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const source = audioCtx.createMediaElementSource(audio);

		const analyser = audioCtx.createAnalyser();
		const gainNode = audioCtx.createGain();
		gainNode.gain.value = 0.4;
		// source -> analyser
		source.connect(analyser);

		// analyser -> gainNode
		analyser.connect(gainNode);

		// gainNode -> 扬声器
		gainNode.connect(audioCtx.destination);


		const bufferLength = analyser.frequencyBinCount;
		const domainArray = new Uint8Array(bufferLength);
		const frequencyArray = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(domainArray);
		let time = 0;
		function draw() {
			window.requestAnimationFrame(draw);

			if (play) {
				// analyser.getByteTimeDomainData(domainArray);
				// console.log('data', domainArray);
				// console.log('frequency', frequencyArray);
				// time++

				analyser.getByteTimeDomainData(domainArray);

				canvasCtx.fillStyle = "rgb(220, 220, 220)";
				canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

				canvasCtx.lineWidth = 2;
				canvasCtx.strokeStyle = "rgb(0, 0, 0)";

				canvasCtx.beginPath();
				let skip = 2 ** 4;
				var sliceWidth = canvas.width * 1.0 / bufferLength * skip;
				var x = 0;

				for (let i = 0; i < bufferLength; i++) {

					var v = domainArray[i] / 128.0;
					var y = v * canvas.height / 2;

					if (i === 0) {
						canvasCtx.moveTo(x, y);
					} else {
						canvasCtx.lineTo(x, y);
					}

					x += sliceWidth;
				}

				canvasCtx.lineTo(canvas.width, canvas.height / 2);
				canvasCtx.stroke();

				// 频率
				analyser.getByteFrequencyData(frequencyArray);

				canvas1Ctx.fillStyle = 'rgb(220, 220, 220)';
				canvas1Ctx.fillRect(0, 0, canvas1.width, canvas1.height);
				var barWidth = (canvas1.width / bufferLength * skip) * 2.5;
				var barHeight;
				var x = 0;

				for (let i = 0; i < bufferLength; i++) {
					barHeight = frequencyArray[i];

					canvas1Ctx.fillStyle = 'rgb(' + (barHeight + 100) + '50,50,50)';
					canvas1Ctx.fillRect(x, canvas1.height - barHeight / 2, barWidth, barHeight / 2);
					x += barWidth + 1;
				}
			}

		}

		draw()
	})
</script>
```