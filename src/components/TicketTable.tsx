import React, { useState } from "react";
import useTable from "../hooks/useTable";
import styles from "../Table.module.css";
import TableFooter from "./TableFooter";
import type { ITicket } from "../types/ticket";
import type { IUser } from "../types/user";
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import TicketService from '../services/ticket.service';

interface TableProps {
  data: ITicket[];
  users: IUser[];
  rowsPerPage: number;
}

const TicketTable: React.FC<TableProps> = ({ data, users, rowsPerPage }) => {
  const [page, setPage] = useState<number>(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState('');

  const handleClose = () => {
    setShow(false);
    setItemIdToDelete('');
  }
  const handleShow = () => setShow(true);

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateTicket = (id: number) => {
    navigate('/update-ticket/' + id);
  };

  const handlePendingTicket = async (id: string) => {
    setLoading(true);
    await TicketService.pendingTicket(id).then(
      () => {
        setLoading(false);
        alert("Ticket status updated successfully.");
        window.location.reload();
      },
      (error) => {
        setLoading(false);
        const resMessage = error.response.data.error;
        alert(resMessage);
      }
    );
  };

  const handleCompletedTicket = async (id: string) => {
    setLoading(true);
    await TicketService.completedTicket(id).then(
      () => {
        setLoading(false);
        alert("Ticket status updated successfully.");
        navigate('/dashboard');
      },
      (error) => {
        setLoading(false);
        const resMessage = error.response.data.error;
        alert(resMessage);
      }
    );
  };

  const handleDeleteTicket = async (id: string) => {
    debugger;
    setItemIdToDelete(id);
    handleShow();
  };

  const confirmDeleteTicket = async () => {
    debugger;
    await TicketService.deleteTicket(itemIdToDelete).then(
      () => {
        alert("Ticket deleted successfully.");
        handleClose();
        window.location.reload();
      },
      (error) => {
        const resMessage = error.response.data.error;
        alert(resMessage);
      }
    );
  };

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>Ticket #</th>
            <th className={styles.tableHeader}>Reported By</th>
            <th className={styles.tableHeader}>Assigned To</th>
            <th className={styles.tableHeader}>Accommodation Name</th>
            <th className={styles.tableHeader}>Room No.</th>
            <th className={styles.tableHeader}>Specific Location</th>
            <th className={styles.tableHeader}>Accommodation Type</th>
            <th className={styles.tableHeader}>Request Type</th>
            <th className={styles.tableHeader}>Details</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Priority</th>
            <th className={styles.tableHeader}>Notes</th>
            <th className={styles.tableHeader}>Image</th>
            <th className={styles.tableHeader}>Alert Level</th>
            <th className={styles.tableHeader}>Created Date</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el: ITicket) => (
            <tr className={styles.tableRowItems} key={el.id}>
              <td className={styles.tableCell}>{el.id}</td>
              <td className={styles.tableCell}>{el.reported_by}</td>
              <td className={styles.tableCell}>{users?.find(user => user.id === parseInt(el.assigned_to))?.first_name + " " + users?.find(user => user.id === parseInt(el.assigned_to))?.last_name}</td>
              <td className={styles.tableCell}>{el.accommodation_name}</td>
              <td className={styles.tableCell}>{el.accommodation_room_number == "0" ? "N/A" : el.accommodation_room_number}</td>
              <td className={styles.tableCell}>{el.accommodation_specific_location}</td>
              <td className={styles.tableCell}>{el.accommodation_type}</td>
              <td className={styles.tableCell}>{el.request_type}</td>
              <td className={styles.tableCell}>{el.request_detail}</td>
              <td className={styles.tableCell}>{el.task_status}</td>
              <td className={styles.tableCell}>{el.task_priority}</td>
              <td className={styles.tableCell}>{el.note}</td>
              <td className={styles.tableCell}>{el.image}</td>
              <td className={styles.tableCell}>{el.task_status === "Completed" ? (<p className="perfect-alert">Done</p>) : el.alert_level == 0 ? (<p className="good-alert">Not Completed</p>) : el.alert_level == 1 ? (<p className="warn-alert">Not Completed</p>) : (<p className="red-alert">Not Completed</p>)}</td>
              <td className={styles.tableCell}>{el.created_date}</td>
              <td id="last-cell" className={styles.tableCell}>
                {el.task_status === "Assigned" ?
                  <div>
                    <Button className="text-nowrap btn-sm edit-btn" onClick={() => handlePendingTicket(el.id.toString())}>
                      Mark as Pending
                    </Button>
                    <Button className="text-nowrap btn-sm edit-btn" onClick={() => handleUpdateTicket(el.id)}>
                      <i className="fa fa-pencil"></i>
                    </Button>
                  </div>
                  : el.task_status === "Pending" ? <div>
                    <Button className="text-nowrap btn-sm edit-btn" onClick={() => handleCompletedTicket(el.id.toString())}>
                      Mark as Completed
                    </Button>
                    <Button className="text-nowrap btn-sm edit-btn" onClick={() => handleUpdateTicket(el.id)}>
                      <i className="fa fa-pencil"></i>
                    </Button>
                  </div> : ""
                }

                <Button className="text-nowrap btn-sm btn-danger delete-btn" onClick={() => handleDeleteTicket(el.id.toString())}>
                  <i className="fa fa-trash"></i>
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Are you sure you want to delete this ticket?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={confirmDeleteTicket}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
      {loading && (
        <div id="loadingOverlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>)}
    </>
  );
};

export default TicketTable;