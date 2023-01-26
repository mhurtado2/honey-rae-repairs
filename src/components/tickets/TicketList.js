import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Tickets.css"


export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
        const searchedTickets = tickets.filter(ticket => {
            return ticket.description.toLowerCase().startsWith(searchTermState.toLowerCase())
        })
        setFiltered(searchedTickets)
    },
        [ searchTermState ]
    )

    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets)
            }
        },
        [emergency] //observing emergency 
    )

    useEffect(
        () => {
            fetch('http://localhost:8088/serviceTickets')
                .then(response => response.json())
                .then((ticketArray) => {
                    setTickets(ticketArray)
                })
            // View the initial state of tickets
        },
        [] // When this array is empty, you are observing initial component state
    )

    useEffect(() => {
        if (honeyUserObject.staff) {
            //for employees
            setFiltered(tickets)
        }
        else {
            // for customers
            const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
            setFiltered(myTickets)

        }
    }, [tickets])

    useEffect(
        () => {
            if (openOnly) {
                const openTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFiltered(openTicketArray)
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }

        }, [openOnly])

    return <>
        {
            honeyUserObject.staff //tenary statement
                ? <>
                    <button onClick={() => { setEmergency(true) }}>Emergency Only</button>
                    <button onClick={() => { setEmergency(false) }}>Show All</button>
                </>
                : <>
                    <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
                    <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
                    <button onClick={() => updateOpenOnly(false)}>All My Tickets</button>
                </>
        }

        <h2>List of Tickets</h2>
        <article className="tickets">
            {
            filteredTickets.map((ticket) => {
            return  <section className="ticket" key={ticket.id}>
                <header>
                <Link to={`/tickets/${ticket.id}`}>Ticket {ticket.id}</Link>
                </header>
                    <section>{ticket.description}</section>
                    <footer>Emergency: {ticket.emergency ? "🧨" : "No"}</footer>
                            </section> 
                      })
                  }
 
        </article>
        </>
}

{/* <section className="ticket" key={ticket.id}>
                        <header>{ticket.description}</header>
                        <footer>Emergency: {ticket.emergency ? "Yes" : "No"}</footer>
                    </section> */}


                //     <section className="ticket">
                //     <header>
                //         <Link to={`/tickets/${ticket.id}`}>Ticket {ticket.id}</Link>
                //     </header>
                //     <section>{ticket.description}</section>
                //     <footer>Emergency: {ticket.emergency ? "🧨" : "No"}</footer>
                //   <section/>