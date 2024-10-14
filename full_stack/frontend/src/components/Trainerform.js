import React, { useState } from 'react'; 
import axios from 'axios'; 
import { AiOutlineClose } from 'react-icons/ai'; 

const TrainerForm = ({ onAdd, onClose }) => {
    // State variables for form fields
    const [trainerId, setTrainerId] = useState(''); // Trainer ID state
    const [name, setName] = useState(''); // Name state
    const [email, setEmail] = useState(''); // Email state
    const [phone, setPhone] = useState(''); // Phone state
    const [expertise, setExpertise] = useState(''); // Expertise state

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Send POST request to add a new trainer
            const response = await axios.post('http://localhost:5000/admin/add-trainer', {
                trainerId,
                name,
                email,
                phone,
                expertise,
            });

            // Log the response for debugging purposes
            console.log('Response from backend:', response.data);

            // Call onAdd prop with the new trainer data
            onAdd(response.data.trainer);
            alert(response.data.message); // Show success message

            // Reset form fields
            setTrainerId('');
            setName('');
            setEmail('');
            setPhone('');
            setExpertise('');

            // Close the form after submission
            onClose();
        } catch (error) {
            console.error('Error adding trainer:', error); // Log error
            alert('Failed to add trainer. Please try again.'); // Show error message
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form"> {/* Form element */}
            <div className="form-header"> {/* Header for the form */}
                <h2>Add Trainer</h2>
                <AiOutlineClose className="close-icon" onClick={onClose} /> {/* Close icon */}
            </div>
            {/* Input fields for trainer details */}
            <input
                type="text"
                placeholder="Trainer ID"
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)} // Fixed variable name
                required
            />
            <button type="submit">Add Trainer</button> {/* Submit button */}
        </form>
    );
};

export default TrainerForm; // Export the TrainerForm component
