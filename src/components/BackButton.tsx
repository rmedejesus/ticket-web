import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigates one step back in the history stack
  };

  return (
    <Button className="text-nowrap mt-3 mb-3" onClick={handleGoBack}>
      Back
    </Button>
  );
};

export default BackButton;