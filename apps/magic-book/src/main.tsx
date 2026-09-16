import React from 'react';
import ReactDOM from 'react-dom/client';
import {MagicBook} from './components/MagicBook';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MagicBook />
    </React.StrictMode>
);
