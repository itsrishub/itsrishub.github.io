var example = ['Expect the unexpected!', 'I play with kernals.', 'Have you seen my penguin?', 'Serial coder.', 'fuzzing my code..'];

textSequence(0);
function textSequence(i) {

    if (example.length > i) {
        setTimeout(function() {
            document.getElementById("flex").innerHTML = example[i];
            textSequence(++i);
        }, 2000);

    } else if (example.length == i) {
        textSequence(0);
    }

  }