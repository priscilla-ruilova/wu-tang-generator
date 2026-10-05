document.querySelector('button').addEventListener('click', wuTang)

function wuTang(){
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
    const answers = questions.map(function(question){ //map is a fancy name for translate. It takes in an array of qestions and returns an array of answers which is the same size. It will run the callback function to return the a question.
        const picked = document.querySelector('input[name = "' + question + '"]:checked') //instead of using the index, we can call name. we;re looking for name and using the map function to make the next one q1 and the following q2 and then q3. Checked will only grab the ones that are checked. [] is a way to compare the attribute name to a certain value (q1 or q2). This syntax is equal to (`input[name = "${question}"]`)
        return picked ? picked.value : '' //this makes sure an unaswered question with no checked input remains empty instead of it giving us an error
    })
    if (answers.includes('')){
        document.querySelector('#message').innerText = 'Protect your NECK'
        return
    }
    const query = questions
    .map(function(question, index){
        return question + '=' + answers[index];
    })
    .join('&')

    fetch('/api?' + query)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            document.querySelector('#result').innerText = 'From this day forward, your name is: ' + data.name
        })
}