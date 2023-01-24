import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"


export const EmployeeDetails = () => {

    const {employeeId} = useParams()
    const [employee, updateEmployee] = useState()

    useEffect(
        () => {
            fetch(`http://localhost:8088/employees?_expand=user&_embed=employeeTickets&userId=${employeeId}`)
            .then((response) => response.json)
            .then((data) => {
                const singleEmployee = data[0]
                updateEmployee(singleEmployee)
            })
        }, 
        [employeeId]
    )
    return <></>
} 