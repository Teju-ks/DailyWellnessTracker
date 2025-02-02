import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatToggle from '../components/ChatToggle';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [expanded, setExpanded] = useState(null); // State to manage FAQ expansion
    const [navbarClass, setNavbarClass] = useState('navbar-transparent'); // State to manage navbar class

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });

        // Add scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavbarClass('navbar-black');
            } else {
                setNavbarClass('navbar-transparent');
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to toggle the expanded state
    const toggleFAQ = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    // Example FAQ data
    const faqs = [
        {
            question: 'What is the Mental Health Management System?',
            answer: 'The Mental Health Management System is a comprehensive platform designed to manage patient records, provide mental health services, and support mental wellness initiatives.'
        },
        {
            question: 'How can I create an account?',
            answer: 'To create an account, go to the sign-up page, fill in the required details, and submit the form. You will receive a confirmation email to activate your account.'
        },
        {
            question: 'What services are offered?',
            answer: 'We offer a wide range of services including therapy sessions, support groups, medication management, and access to mental health resources.'
        },
        {
            question: 'How can I contact support?',
            answer: 'You can contact our support team via email at support@mentalhealthsystem.com or call us at (123) 456-7890. We are available 24/7 to assist you.'
        }
    ];

    return (
        <div>
            <section className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Your Journey to Mental Wellness</h1>
                    <p className="hero-subtitle">Track, improve, and nurture your mental health with our comprehensive tools</p>
                </div>
            </section>

            <section className="cards-section">
                <div className="textabove" style={{
                    fontSize: '30px', border: '0.5px solid white', width: '150px', marginLeft: '80px', borderRadius: '12px'
                }}>Services :</div>
                <div className="container">
                    <div className="py-5">
                        <div className="scroll-container">
                            {[
                                { title: 'Mood Tracker', text: 'How are you feeling today...?', bgClass: 'card-bg1' },
                                { title: 'Food Journal', text: 'What did you eat...?', bgClass: 'card-bg2' },
                                { title: 'Study', text: 'What did you study...?', bgClass: 'card-bg3' },
                                { title: 'Self Care', text: "Today's Tip", bgClass: 'card-bg4' },
                                { title: 'Morning Routine', text: 'What did you do this morning...?', bgClass: 'card-bg5' },
                                { title: 'Social Media Detox', text: 'Your Screentime..!', bgClass: 'card-bg6' }
                            ].map((card, index) => (
                                <div key={index} className="card-container">
                                    <a href="/login" className="card-link">
                                        <div className={`card shadow ${card.bgClass}`}>
                                            <div className="overlay"></div>
                                            <div className="card-body">
                                                <h5 className="card-title">{card.title}</h5>
                                                <p className="card-text">{card.text}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="cards-section">
                <div className="container">
                    <div className="py-5">
                        <div className="scroll-container">
                            {users.map(user => (
                                <div key={user.id} className="card-container">
                                    <div className="card shadow card-bg1">
                                        <div className="overlay"></div>
                                        <div className="card-body">
                                            <h5 className="card-title">{user.name}</h5>
                                            <p className="card-text">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section">
                <div className="container">
                    <h1 className="text-center">About Us</h1>
                    <p className="lead text-center">Learn more about our mission, vision, and values.</p>
                    <div className="row">
                        <div className="col-lg-6">
                            <h2>Our Mission</h2>
                            <p>Our mission is to empower individuals to improve their mental wellness through accessible and effective tools.</p>
                        </div>
                        <div className="col-lg-6">
                            <h2>Our Vision</h2>
                            <p>We envision a world where mental wellness is a priority, and everyone has the resources they need to thrive emotionally and mentally.</p>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-lg-12">
                            <h2>Our Values</h2>
                            <ul>
                                <li><strong>Empathy:</strong> Understanding and sharing the feelings of others.</li>
                                <li><strong>Accessibility:</strong> Making mental wellness resources available to all.</li>
                                <li><strong>Innovation:</strong> Continuously improving our tools and approaches.</li>
                                <li><strong>Community:</strong> Building a supportive network for mental wellness.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <section className="faq-container">
                    <h1 className="text-center mb-4">Frequently Asked Questions</h1>
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-header" onClick={() => toggleFAQ(index)}>
                                <h5>{faq.question}</h5>
                                <span className="faq-icon">{expanded === index ? '-' : '+'}</span>
                            </div>
                            {expanded === index && (
                                <div className="faq-body">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                <ChatToggle />
            </section>

            <footer className="bg-dark text-white mt-5">
                <div className="container py-4">
                    <div className="row">
                        <div className="col-md-4">
                            <h5>Contact Us</h5>
                            <p>Email: mindfullme@gmail.com</p>
                            <p>Phone:  +1234567890</p>
                        </div>
                        <div className="col-md-4">
                            <h5>Follow Us</h5>
                            <a href="#" className="text-white">Facebook</a>  
                            <a href="#" className="text-white">Twitter</a>
                            <a href="#" className="text-white">Instagram</a>
                        </div>
                        <div className="col-md-4">
                            <h5>Quick Links</h5>
                            <a href="#" className="text-white">Home</a>
                            <a href="#" className="text-white">About</a>
                            <a href="#" className="text-white">Contact</a>
                        </div>
                    </div>
                    <div className="text-center pt-3">
                        <p>&copy; 2024 Your Website Name. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}