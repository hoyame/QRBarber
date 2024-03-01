import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import Cookies from 'js-cookie';

import "./styles/main.scss";
import axios from "axios";

const App = () => {
  const [status, setStatus] = useState(false);
  const [time, setStateTime] = useState(0);
  const [place, setStatePlace] = useState(0);
  // if (!isMobile) return <div>Disponible uniquement sur telephone</div>;

  const setTime = (data: any) => {
    if (data && data.data) {
      setStatePlace(data.data.place)
      setStateTime(data.data.time)
    } else {
      setStateTime(data.message)
    }
    console.log(data)
  }

  useEffect(() => {
    if (Cookies.get('uuid')) return;
    if (status) return;

    const uuid = uuidv4()
    Cookies.set('uuid', uuid, { expires: 1 })

    setStatus(true)
  }, [status]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8081/api/getTime`, {params: {uuid: Cookies.get('uuid')}}).then(res => setTime(res.data))

    setInterval(() => {
      axios.get(`http://127.0.0.1:8081/api/getTime`, {params: {uuid: Cookies.get('uuid')}}).then(res => setTime(res.data))
    }, 10000)
  }, [time])

  axios.post(`http://127.0.0.1:8081/api/register`, {uuid: Cookies.get('uuid')});

  return (
    <div className="container">

    {
      place ? 
        <div className="contenent">
          <p className="title">BIENVENUE à R’cut luxury</p>

          <div className="container-place">
            <p className="information-place">{place}</p>
            <p className="information-title">Votre place</p>
          </div>

          <div className="container-place">
            <p className="information-place">{time}</p>
            <p className="information-title">MINUTES D'ATTENTE</p>
          </div>

          <p style={{marginTop: 25}} className="description">Réserver vous permettra d'entrer dans la file d'attente des sans rendez-vous, afin de pouvoir obtenir une estimation du temps d'attente.</p>
        </div>
      :
        <div className="contenent">
          <p className="title">BIENVENUE à R’cut luxury</p>
          <p className="title">il y’a actuellement</p>

          <p className="time">{time}</p>
          <p className="time-title">minutes d’attente</p>

          <div className="button" onClick={() => {
            axios.post(`http://127.0.0.1:8081/api/addInQueue`, {uuid: Cookies.get('uuid')}) .then(res => {
              console.log(res);
              console.log(res.data);
            })
          }}>
            Réserver
          </div>

          <p className="description">Réserver vous permettra d'entrer dans la file d'attente des sans rendez-vous, afin de pouvoir obtenir une estimation du temps d'attente.</p>
        </div>
      }
    </div>
  );
}

export default App;