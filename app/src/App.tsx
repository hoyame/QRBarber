import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import Cookies from 'js-cookie';

import "./styles/main.scss";
import axios from "axios";

const App = () => {
  const [status, setStatus] = useState(false);
  const [time, setTime] = useState(0);
  // if (!isMobile) return <div>Disponible uniquement sur telephone</div>;

  useEffect(() => {
    if (Cookies.get('uuid')) return;
    if (status) return;

    const uuid = uuidv4()
    Cookies.set('uuid', uuid, { expires: 1 })

    setStatus(true)
  }, [status]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8081/api/getTime`, {params: {uuid: Cookies.get('uuid')}}).then(res => setTime(res.data.message))

    setInterval(() => {
      axios.get(`http://127.0.0.1:8081/api/getTime`, {params: {uuid: Cookies.get('uuid')}}).then(res => setTime(res.data.message))
    }, 10000)
  }, [time])

  axios.post(`http://127.0.0.1:8081/api/register`, {uuid: Cookies.get('uuid')}) .then(res => {
    console.log(res);
    console.log(res.data);
  })

  return (
    <div>
      {time}

      <button type="button" title="sheeesh" onClick={() => {
        console.log("zeuybuf")

        axios.post(`http://127.0.0.1:8081/api/addInQueue`, {uuid: Cookies.get('uuid')}) .then(res => {
          console.log(res);
          console.log(res.data);
        })
      }}>zs</button>
    </div>
  );
}

export default App;