const SCREEN_STATUS = {
	QUESTION_SELECTING: "QUESTION_SELECTING",
	QUESTION_LOADING: "QUESTION_LOADING",
	QUESTION_LOAD_ERROR: "QUESTION_LOAD_ERROR",
	QUESTION_SELECTED: "QUESTION_SELECTED",
}

const ANSWER_STATUS = {
	INVALID: "INVALID",
	SELECTING: "SELECTING",
	SELECTED: "SELECTED",
	FINISHED: "FINISHED"
}

const store = {
	debug: true,
	state: {
		screen: SCREEN_STATUS.QUESTION_SELECTING,
		question: {
			list: [
				{
					title: 'サンプルデータ',
					description: '適当な一問一答データです',
					url: './static/sample_question.json'
				}
			],
			selected: false
		},
		answer: {
			state: ANSWER_STATUS.INVALID,
			index: false,
			result: {
				correct_count:0
			}
			
		}
	},
	debugConsole() {
		if (this.debug)
		{
			console.dir(this.state);
		}
	},
	questionSelect(url) {
		this.state.question.selected = false;

		this.state.screen = SCREEN_STATUS.QUESTION_LOADING;

		axios.get(url)
			.then(function (response) {
				console.dir(response);
				store.questionLoaedFinish(response.data);
			})
			.catch(function (error) {
				console.log(error);
				store.questionLoaedFailed();
			})
	},
	questionLoaedFinish(data) {
		this.state.screen = SCREEN_STATUS.QUESTION_SELECTED;
		this.state.question.selected = data;

		this.state.answer.state = ANSWER_STATUS.SELECTING;
		this.state.answer.index = 0;
		this.state.answer.result.correct_count = 0;
		this.debugConsole();
	},
	questionLoaedFailed() {
		this.state.screen = SCREEN_STATUS.QUESTION_LOAD_ERROR;
		this.debugConsole();
	},
	answerSelect(index) {
		this.state.answer.state = ANSWER_STATUS.SELECTED;
		const question = this.state.question.selected[this.state.answer.index];
		if (question.selections[index].isCorrect) {
			this.state.answer.result.correct_count++;
		}
		this.state.answer.index++;
		if (this.state.answer.index >= this.state.question.selected.length) {
			this.state.answer.state = ANSWER_STATUS.FINISHED;
			this.state.screen = SCREEN_STATUS.QUESTION_SELECTING;
		}
	}
};

var app = new Vue({
	el: '#app',
	data: store.state,
	template: '#main-page',
	methods: {
		questionSelect: function (url) {
			store.questionSelect(url);
		},
		answerSelect: function (index) {
			store.answerSelect(index);
		}
	}
});

var myApp = new Framework7({
	swipePanel: 'left'
});
var $$ = Dom7;
// Add the view
var mainView = myApp.addView('.view-main', {
	// enable the dynamic navbar for this view:
	dynamicNavbar: true
});
