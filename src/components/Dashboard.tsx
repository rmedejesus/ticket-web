import React, { useEffect, useState } from 'react';
import TicketService from '../services/ticket.service';
import type { ITicket } from '../types/ticket';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { IUser } from '../types/user';
import userService from '../services/user.service';
import TicketTable from './TicketTable';

const Dashboard: React.FC = () => {
  const [content, setContent] = useState<ITicket[]>([]);
  const [filteredContent, setFilteredContent] = useState<ITicket[]>([]);
  const [users, setUsers] = useState<IUser[]>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    TicketService.getTickets().then(
      async (response) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContent(response.data);
        setLoading(false);
      },
      (error) => {
        const _content = error.response.data.error;

        setContent(_content);
      }
    );
  }, []);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const response = await userService.getUsers();

    //     setUsers(response.data);
    //     setLoading(false);
    //   } catch (error) {
    //     const _content = error;

    //     setUsers(_content);
    //   }
    // }
    userService.getUsers().then(
      async (response) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(response.data);
        setLoading(false);
      },
      (error) => {
        const _content = error.response.data.error;

        setUsers(_content);
      }
    );
  }, []);

  useEffect(() => {
    const newFilteredData = content.filter(item =>
      item.id === Number(searchTerm) ||
      item.reported_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users?.find(user => user.id === parseInt(item.assigned_to))?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users?.find(user => user.id === parseInt(item.assigned_to))?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accommodation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accommodation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.task_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.task_priority.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContent(newFilteredData);
  }, [searchTerm, content]);

  if (loading) {
    return <div id="loading-data"><p className="spinner-grow custom-spinner-size text-danger"></p><h3>Loading tickets...</h3></div>;
  }

  const handleCreateTicket = () => {
    navigate('/create-ticket');
  };

  return (
    <div className="main-container">
      <div className="d-flex mb-4 gap-3 upper-container">
        <Button className="text-nowrap create-btn" onClick={handleCreateTicket}>
          Create a New Ticket
        </Button>
        <input
          type="text"
          placeholder="Search by Staff Name, Accommodation Name, Accommodation Type, Request Type, Status, or Priority..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded search-terms"
        />
      </div>
      <div id="table-container">
        {filteredContent != null ? <TicketTable data={filteredContent!} users={users!} rowsPerPage={7} /> : <p>No data</p>}
        {/* {filteredContent !== null ? (filteredContent as ITicket[]).length > 0 ? <TicketTable data={filteredContent!} users={users!} rowsPerPage={7} /> : content !== null ? (content as ITicket[]).length > 0 ? <TicketTable data={content!} users={users!} rowsPerPage={7} /> : <p>No data</p> : <p>No data</p> : <p>No data</p>} */}
      </div>
    </div>
  );
};

export default Dashboard;