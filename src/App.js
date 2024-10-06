// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Victorina from './components/Victorina';
import WebSocketClient from './components/ws';
import Store from './store/store';
import Market from './components/marketgame';
import Crossword from './components/crossword';
import TourUpload from './TravelTime/TourUpload';
import TourShowcase from './TravelTime/TourShowcase';
import LocationShowcase from './TravelTime/LocationShowcase';
import TourDetail from './TravelTime/TourDetail';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/WebSocketClient" element={<WebSocketClient />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/victorina" element={<Victorina />} />
                    <Route path="/crossword" element={<Crossword />} />
                    <Route path="/TourUpload" element={<TourUpload />} />
                    <Route path="/TourShowcase" element={<TourShowcase />} />
                    <Route path="/locations/:location" element={<LocationShowcase />} />
                    <Route path="/tours/:id" element={<TourDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
