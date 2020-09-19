import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { messages } from '../../helpers/calendar-messages-es';

import 'moment/locale/es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventSetActive, eventCleanActiveEvent, eventStartLoading } from '../../actions/events';
import { AddNewFav } from '../ui/AddNewFav';
import { DeleteEventFab } from '../ui/DeleteEventFab';
moment.locale('es');

const localizer = momentLocalizer(moment); // or globalizeLocalizer

/* const events = [{
    title: 'Cumpleaños del jefe',
    start: moment().toDate(),
    end: moment().add(2, 'hours').toDate(),
    bgcolor: '#fafafa',
    notes: 'Comprar el pastel',
    user: {
        _id: '123',
        name: 'Fabricio'
    }
}]; */

export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector( state => state.auth );

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')

    useEffect(() => {
        
        dispatch( eventStartLoading() );
        
    }, [dispatch])

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    }

    const onSelect = (e) => {
        dispatch(eventSetActive(e));
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch( eventCleanActiveEvent() );
    }

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: (uid === event.user._id) ? '#367cf7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }
        
        return {
            style
        }
    }

    return (
    <div className="calendar-screen">
        <Navbar />

        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            eventPropGetter={eventStyleGetter}
            onDoubleClickEvent={onDoubleClick}
            onSelectEvent={onSelect}
            onView={onViewChange}
            view={lastView}
            onSelectSlot={onSelectSlot}
            selectable={true}
            components={{
                event: CalendarEvent
            }}
        />

        { activeEvent && <DeleteEventFab /> }
        
        <AddNewFav />

        <CalendarModal />

    </div>);
};
