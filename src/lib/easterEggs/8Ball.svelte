<script>
	// magic 8 ball
	let answers = [
		'It is certain',
		'It is decidedly so',
		'Without a doubt',
		'Yes, definitely',
		'You may rely on it',
		'As I see it, yes',
		'Most likely',
		'Outlook good',
		'Yes',
		'Signs point to yes',
		'Ask again later',
		'Better not tell you now',
		'Cannot predict now',
		'Concentrate and ask again',
		"Don't count on it",
		'My reply is no',
		'My sources say no',
		'Outlook not so good',
		'Very doubtful'
	];
	$: currentAnswer = '8';
	function getAnswer(question) {
		console.log(question);
		currentAnswer = answers[Math.floor(Math.random() * answers.length)];
		return answers[Math.floor(Math.random() * answers.length)];
	}

	function getQuestion() {
		let question = prompt('Ask a question');
		getAnswer(question);
	}
</script>

<div class="ball pt-10">
	<div
		class="font-bold rounded-full bg-black flex items-center justify-center font-mono"
		style="height: 400px; width: 400px;"
	>
		<div
			class="font-bold rounded-full bg-white flex items-center justify-center font-mono"
			style="height: 170px; width: 170px;"
		>
			<p id="answer" class="answer text-black text-center font-bold text-lg justify-center">{currentAnswer}</p>
		</div>
	</div>
</div>

<div class="button justify-center items-center pl-24">
	<button on:click={getQuestion} id="questionButton" class=" m-5 p-5 bg-purple-600 rounded-lg">Ask me a question</button>
</div>

