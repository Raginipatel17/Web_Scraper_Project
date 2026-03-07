import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import axios from 'axios';
import TicketModal from './form';

function App() {
  const [events,setevent]=useState([]);
  const [selectedEvent,setselectedEvent]=useState(null);
  // const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    axios.get("http://localhost:2100/events").then((res)=>setevent(res.data));
  },[]);
  return (
    <>
    <div className="fixed bg-white w-full z-100">
  <div className="flex items-center p-4 justify-center gap-2">
    <h1 className="font-bold text-4xl font-serif">Events from</h1>
    <img src="/logo.png" className="h-10 rounded-xl object-cover" />
  </div>
</div>
    <div className='p-8'>
    <div className="bg-[url('/sydney2.jpg')] bg-cover bg-center h-100 w-full rounded-xl p-8 pt-15  opacity-85">
    <span className='text-white font-bold text-5xl'>Best events in</span>
<h1 className='text-white font-bold text-7xl'>Sydney</h1>
<p className='text-white font-bold text-xl mt-5'>Looking for something to do in Sydney?<br></br> Whether you're a local, new in town or just cruising through we've got loads of great tips and events. <br></br>You can explore by location, what's popular, our top picks, free stuff... you got this. Ready?</p>
    {/* <img src="../public/sydney.jpg" className='h-100 w-full rounded-xl object-cover mt-4'></img> */}
    </div>

    </div>
    <h1 className='text-2xl font-semibold font-sans m-5 mb-1'>Sydney Events</h1>
    <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      
      {events.map(e => (
        <div key={e._id} className={`p-4 rounded-xl shadow-lg shadow-blue-400  border-blue-400 scale-100 transition delay-20 duration-300 ease-in-out hover:scale-105 hover:transform-gpu cursor-pointer`}>
          <div className={`${selectedEvent?"blur-sm pointer-events-none":""}`}>
          <img src={e.image} alt="" className="h-50 w-full rounded-xl object-cover" />
          <h2 className="font-bold text-lg m-2 mb-0">{e.title}</h2>
          {/* <p>{e.dateTime}</p> */}
          <p className='className="font-bold m-2'>Venue & Time - {e.venue}</p>
          <span className='bg-red-400 text-white  px-2 py-1 m-2 rounded-xl cursor-pointer'>{e.status===''?null:e.status}</span>
          <span className='bg-red-400 text-white  px-2 py-1 m-1 rounded-xl cursor-pointer'>{e.category}</span>
          <p className="text-sm m-3">{e.description}</p>

          <button
  onClick={() => setselectedEvent(e)}
  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
>
  GET TICKETS
</button>
</div>



        </div>
      ))}
      {
        selectedEvent &&
                <TicketModal 
  event={selectedEvent} 
  close={() => setselectedEvent(null)} 
/>
      }
    </div>
    </>
  );
}

export default App
