import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [joke, setJoke] = useState({});
  // const [jokeOpinions, setJokeOpinions] = useState([]);
  const [likedJokes, setLikedJokes] = useState([]);
  const [dislikedJokes, setDislikedJokes] = useState([]);
  const [likedJokesHidden, setLikedJokesHidden] = useState(true);
  const [urlParam, setUrlParam] = useState('Any');
  const [checkboxes, setCheckboxes] = useState({'Programming': false, 'Misc': false, 'Dark': false});

  useEffect(() => {
    getJoke()
    
  }, [])

  //test?
  
  useEffect(() => {
    // console.log('url', urlParam);
    getJoke();
  }, [urlParam])

  const likedJoke = (joke) => {
    // setJokeOpinions([...jokeOpinions, {[joke]: true}]);
    setLikedJokes([...likedJokes, joke])
    getJoke();
  }

  const dislikedJoke = (joke) => {
    setDislikedJokes([...dislikedJokes, joke]);
    getJoke();
  }

  const getJoke = () => {
    // console.log('get joke', urlParam)
    axios.get(`https://v2.jokeapi.dev/joke/${urlParam}?safe-mode&type=twopart`)
      .then(res => {
        setJoke(res.data)
        console.log('res-----', res.data)
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  const showJokes = () => {
    setLikedJokesHidden(!likedJokesHidden);
  }

  const removeJokeFromLiked = (id) => {
    const newArray = likedJokes.filter(joke => joke.id !== id);
    // console.log('removed?', newArray)
    setLikedJokes(newArray);
  }

  const changeUrl = (type) => {
    setUrlParam(type);
    getJoke();
  }

  const handleCheckbox = (param) => {
    const newObj = {...checkboxes};
    newObj[param] = !newObj[param];
    setCheckboxes(newObj);
  }

  useEffect(() => {
    const keys = Object.keys(checkboxes);
    const trueCheckboxes = keys.filter(key => checkboxes[key] === true).join(',');
    // console.log('url params-----', trueCheckboxes)
    if(!trueCheckboxes.length) {
      setUrlParam('Any');
    } else {
      setUrlParam(trueCheckboxes);
    }


  }, [checkboxes])

  const queryTypes = ['Programming', 'Misc', 'Dark']

  return (
    <div className="App">
      <div>
        <h2>Choose the type of joke</h2>
        {queryTypes.map(q => {
          return (
            <label>
              <input 
                value={q}
                onChange={() => handleCheckbox(q)}
                type='checkbox'
              />
              {q}
            </label>
          )
        })}
      </div>
      <p>{joke.setup}</p>
      <p>{joke.delivery}</p>
      <button
        onClick={() => likedJoke({setup: joke.setup, delivery: joke.delivery, id: joke.id})}
      >
        Like
      </button>
      <button
        onClick={() => dislikedJoke({setup: joke.setup, delivery: joke.delivery, id: joke.id})}
      >
        Dislike
      </button>
      <button
        onClick={() => showJokes()}
      >
        Show Liked Jokes
      </button>
      {likedJokesHidden === false && (
        <div>
          {likedJokes.map(joke => {
            return (
              <div key={joke.id}>
                <p>{joke.setup}</p>
                <p>{joke.delivery}</p>
                <button
                  onClick={() => removeJokeFromLiked(joke.id)}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

export default App;
