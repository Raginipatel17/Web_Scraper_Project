import axios from "axios";
import { useState } from "react";

export default function TicketModal({ event, close }) {
  const [email,setemail]=useState("");
  const [consent,setconsent]=useState(false);
  if(!event) return null;
  const submit=async(e)=>{
    e.preventDefault();
    await axios.post("https://web-scraper-project-1.onrender.com/email",{
      email,
      consent,
      eventid:event._id,

    })
    window.location.href=event.eventUrl
  }
  return (
    <div className="fixed inset-0  flex justify-center items-center ">
      <div className="rounded-xl shadow-lg bg-white p-6 rounded w-96 relative ">

        <button
          onClick={close}
          className="absolute top-2 right-2 w-6 font-bold h-6 bg-red-600 rounded-full text-white cursor-pointer"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">Book Ticket</h2>

        <form onSubmit={submit}>
          <label for="email">Email Id:</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="border w-full p-2 mb-3 rounded"
            onChange={(e)=>setemail(e.target.value)}
          />
          <input type="checkbox" id="Consent" name="consent" onChange={(e)=>setconsent(e.target.checked)}/>
          <label for="consent"> Do we have consent to send meaningful email to you</label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer" type="submit">
            Continue
          </button>
        </form>

      </div>
    </div>
  );
}
