import { Link } from "react-router-dom";

export const Ticket = ({
  ticketObject,
  currentUser,
  employees,
  getAllTickets,
}) => {
  //Find the assigned employee for the current ticket
  let assignedEmployee = null;

  if (ticketObject.employeeTickets.length > 0) {
    const ticketEmployeeRelationship = ticketObject.employeeTickets[0];
    assignedEmployee = employees.find(
      (employee) => employee.id === ticketEmployeeRelationship.employeeId
    );
  }

  //find the employee profile object for the current user
  const userEmployee = employees.find(
    (employee) => employee.userId === currentUser.id
  );


  //TODO: Function that determines if the current user can close the ticket
  const canClose = () => {
    if (userEmployee?.id === assignedEmployee?.id && ticketObject.dateCompleted === "") {
        return <button onClick={closeTicket} className="ticket_finish">Finish</button>
    }
    else {
        return ""
    }
  }


    //TODO: Function that determines if the current user can close the ticket
    const closeTicket = () => {
        const copy = {
            userId: ticketObject.id,
            description: ticketObject.description,
            emergency: ticketObject.emergency,
            dateCompleted: new Date()

        }

        return fetch(`http://localhost:8088/serviceTickets/${ticketObject.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(copy)
        })
            .then(response => response.json())
            .then(getAllTickets)
    }
    

  const buttonOrNoButton = () => {
    if (currentUser.staff) {
      return (
        <button
          onClick={() => {
            fetch("http://localhost:8088/employeeTickets", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                employeeId: userEmployee.id,
                serviceTicketId: ticketObject.id,
              }),
            })
              .then((response) => response.json())
              .then(() => {
                getAllTickets();
              });
          }}
        >
          Claim
        </button>
      );
    } else {
      return "";
    }
  };

  return (
    <section className="ticket" key={`ticket--${ticketObject.id}`}>
      <header>
        {currentUser.staff ? (
          `Ticket ${ticketObject.id}`
        ) : (
          <Link to={`/tickets/${ticketObject.id}`}>
            Ticket {ticketObject.id}
          </Link>
        )}
      </header>
      <section>{ticketObject.description}</section>
      <section>Emergency: {ticketObject.emergency ? "🧨" : "No"}</section>
      <footer className="assigned">
        {ticketObject.employeeTickets.length
          ? `Assigned to ${
              assignedEmployee !== null ? assignedEmployee?.user?.fullName : ""
            }`
          : buttonOrNoButton()
        }
        {
            canClose()
        }
      </footer>
    </section>
  );
};
