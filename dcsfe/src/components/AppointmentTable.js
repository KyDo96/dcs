import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AppointmentDetails from './modals/AppointmentDetails.js';
// import AppointmentDetailsUpdate from './modals/AppointmentDetailsUpdate';
import './Table.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import setHours from 'date-fns/setHours';
// import setMinutes from 'date-fns/setMinutes';
// import Select from 'react-select';


const AppointmentTable = () => {
    const [app_date, set_app_date] = useState(null);
    const [app_details_is_open, set_app_details_is_open] = useState(false);
    const [app_details2_is_open, set_app_details2_is_open] = useState(false);
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [app_patient_name_id, set_app_patient_name_id] = useState({});
    const [app_user_doctor_name_id, set_app_user_doctor_name_id] = useState({});
    const [app_patient_list, set_app_patient_list] = useState([]);
    const [app_user_doctor_list, set_app_user_doctor_list] = useState([]);
    // const [app_patient_name, set_app_patient_name] =useState('');
    const [app_patient_id, set_app_patient_id] =useState('');
    // const [app_user_doctor_name, set_app_user_doctor_name] =useState('');
    const [app_user_doctor_id, set_app_user_doctor_id] =useState('');
    const [app_search_patient_name, set_app_search_patient_name] = useState('');
    const [app_search_user_doctor_name, set_app_search_user_doctor_name] = useState('');
    const [app_search_date, set_app_search_date] = useState('');
    const [app_search_type, set_app_search_type] = useState('');
    const [app_proc_name, set_app_proc_name] = useState('');
    const [app_proc_duration_minutes, set_app_proc_duration_minutes] = useState('');
    const [app_proc_fields, set_app_proc_fields] = useState(()=>{return [{
        proc_name: '', proc_duration_minutes: 0, proc_cost: 0},
        ]});
    const [app_proc_fields2, set_app_proc_fields2] = useState([]);
    const [app_start_time, set_app_start_time] = useState(null);
    const [app_end_time, set_app_end_time] = useState(null);
    const [app_status, set_app_status] = useState('');
    const [app_total_proc_duration_minutes, set_app_total_proc_duration_minutes] = useState(0);
    const [app_type, set_app_type] = useState('Scheduled');
    const [app_total_proc_cost, set_app_total_proc_cost] = useState(0);
    const [app_pay_amount, set_app_pay_amount] = useState('');
    const [app_pay_balance, set_app_pay_balance] = useState('');
    const [app_pay_change, set_app_pay_change] = useState('');
    const [app_pay_date, set_app_pay_date] = useState(new Date());
    const [showAddPayment, set_showAddPayment] =useState(false);

    useEffect(()=>{
        
        getAppointments();

    }, []);

    const addAppointmentFunction = async ()=>{

        function validateEmptyObjectField(array){
            for (var i=0; i < array.length; i++) {
                if (array[i].procedure === "") {
                    return false;
                }
            }
            return true;
        }

        if (!app_patient_id || !app_user_doctor_id || !app_date ||
            !app_start_time || !app_status || !app_type) {
            alert('Empty field/s')
        }else{

            if (!validateEmptyObjectField(app_proc_fields) || !app_proc_fields.length) {
                console.log('validateEmptyObjectField: ', validateEmptyObjectField(app_proc_fields))
                alert("Empty Procedure/s")
            } else {
                const response = await axios.post("http://172.16.0.103:3001/appointment", {
                    app_patient_id: app_patient_id,
                    app_user_doctor_id: app_user_doctor_id,
                    app_date: formatDateYYYYMMDD(app_date),
                    app_start_time: app_start_time,
                    app_end_time: app_end_time,
                    app_status: app_status,
                    app_type: app_type,
                    app_proc_fields: app_proc_fields,
                    app_pay_fields: {app_pay_amount, app_pay_balance, app_pay_change, app_pay_date:formatDateYYYYMMDD(app_pay_date)},
                 });   

                if (response.data.appointmentInsertOk) { 
                    alert('Appointment Added');
                }else{
                    alert('Failed Adding Appointment');
                }
            }
        }  
    }
    
    const getAppointments = async (data)=>{
        if (data) {
            const response = await axios.post(`http://172.16.0.103:3001/appointments`, data);
            if (response.data) {
                setAppointmentsData(response.data)
            }
        } else {
            const response = await axios.get(`http://172.16.0.103:3001/appointments`);
            if (response.data) {
                setAppointmentsData(response.data)
            }
        }    
    };

    const getPatientList = async (id)=>{
        const resPatientList = await axios.get(`http://172.16.0.103:3001/patient-list`);
        if (!resPatientList.data) {
            alert('Failed getting patient list')
        }else{
            // resPatientList.data.map((patient)=>{
            //     if (patient.patient_id === id) {
            //         set_app_patient_name_id({value: patient.patient_id, label: patient.patient_name});
            //     }
            // });
            
            set_app_patient_list(resPatientList.data);
        }
        
    }

    const getUserDoctorList = async ()=>{
        const resUserDoctorList = await axios.get(`http://172.16.0.103:3001/user-doctor-list`);
        if (!resUserDoctorList.data) {
            alert('Failed getting patient list')
        } 
        set_app_user_doctor_list(resUserDoctorList.data);
        
    }

    const newAppointment = ()=>{
        getUserDoctorList();
        getPatientList();
        set_app_details_is_open(true); 
    };
    
    const formatDate = (app_date)=>{
        let d = new Date(app_date);
        let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        // console.log(`${da}-${mo}-${ye}`);
        return `${da}-${mo}-${ye}`
    }

    const formatDateYYYYMMDD = (dt)=>{
        let year  = dt.getFullYear();
        let month = (dt.getMonth() + 1).toString().padStart(2, "0");
        let day   = dt.getDate().toString().padStart(2, "0");
        // console.log(year + '-' + month + '-' + day);
        return year + '-' + month + '-' + day;
    }

    var timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    const AppointmentDetailsFunction = async (id, patient_name)=>{
        
        const resAppointment = await axios.get(`http://172.16.0.103:3001/appointment/${id}`);
        console.log('resAppointment: ', resAppointment);
        if (resAppointment.data.app_patient_id) {
            // app_patient_list.map((patient)=>{
            //     if (patient.patient_id === resAppointment.data.app_patient_id) {
            //         set_app_patient_name_id((prev)=>{
            //             prev = {value: resAppointment.app_patient_id, label: patient.patient_name};
            //             return prev;
            //         })
            //         console.log('app_patient_name_id: ', app_patient_name_id);
            //         return null;
            //     }
            //     console.log('app_patient_name_id not equl: ', app_patient_name_id);
            //     return null;
            // })
            set_app_patient_name_id({value: resAppointment.data.app_patient_id, label: patient_name});
            getPatientList(resAppointment.data.app_patient_id);
            set_app_details2_is_open(true);
            set_app_user_doctor_id(resAppointment.data.app_user_doctor_id);
            set_app_date(new Date(resAppointment.data.app_date));
            set_app_start_time(new Date(resAppointment.data.app_start_time));
            set_app_status(resAppointment.data.app_status);
            set_app_type(resAppointment.data.app_type);
            set_app_proc_fields([]);
            set_app_proc_fields2((prev)=>{
               return resAppointment.data.resProceduresById
            });

            let totalMinutes = 0;
            let totalCost = 0;
            resAppointment.data.resProceduresById.map((app_proc_field2)=>{
                
                if (app_proc_field2.proc_duration_minutes > 0) {
                    totalMinutes = totalMinutes + app_proc_field2.proc_duration_minutes
                }
                if (app_proc_field2.proc_cost > 0) {
                    totalCost = totalCost + app_proc_field2.proc_cost
                }
            });
            console.log('totalMinutes: ',totalMinutes)

            set_app_end_time(
                new Date(
                    new Date(new Date(resAppointment.data.app_start_time).setMinutes(new Date(resAppointment.data.app_start_time).getMinutes()+totalMinutes))
                        ));
            set_app_total_proc_cost(totalCost);

            getUserDoctorList();
            
        } else {
            alert('patient ID not Found');
        }
        

    }

    return (
        <div className='table-table2-container'>
            <AppointmentDetails
            app_details_is_open={app_details_is_open} set_app_details_is_open={set_app_details_is_open} 
            addAppointmentFunction={addAppointmentFunction}
            // app_patient_name={app_patient_name} set_app_patient_name={set_app_patient_name}
            app_date={app_date} set_app_date={set_app_date}
            app_patient_list={app_patient_list} 
            app_patient_id={app_patient_id} set_app_patient_id={set_app_patient_id}
            // app_user_doctor_name={app_user_doctor_name} set_app_user_doctor_name={set_app_user_doctor_name}
            app_user_doctor_id={app_user_doctor_id} set_app_user_doctor_id={set_app_user_doctor_id}
            app_start_time={app_start_time} set_app_start_time={set_app_start_time} 
            app_proc_name={app_proc_name} set_app_proc_name={set_app_proc_name}
            app_proc_duration_minutes={app_proc_duration_minutes} set_app_proc_duration_minutes={set_app_proc_duration_minutes}
            app_proc_fields={app_proc_fields} set_app_proc_fields={set_app_proc_fields}
            app_end_time={app_end_time} set_app_end_time={set_app_end_time} 
            app_status={app_status} set_app_status={set_app_status}
            app_total_proc_duration_minutes={app_total_proc_duration_minutes} set_app_total_proc_duration_minutes={set_app_total_proc_duration_minutes}
            app_type={app_type} set_app_type={set_app_type}
            app_total_proc_cost={app_total_proc_cost} set_app_total_proc_cost={set_app_total_proc_cost}
            app_pay_amount={app_pay_amount} set_app_pay_amount={set_app_pay_amount}
            app_pay_balance={app_pay_balance} set_app_pay_balance={set_app_pay_balance}
            app_pay_change={app_pay_change} set_app_pay_change={set_app_pay_change}
            app_user_doctor_list={app_user_doctor_list}
            app_pay_date={app_pay_date} set_app_pay_date={set_app_pay_date}
            showAddPayment={showAddPayment} set_showAddPayment={set_showAddPayment}

            ></AppointmentDetails>

            {/* <AppointmentDetailsUpdate
                app_details2_is_open={app_details2_is_open} set_app_details2_is_open={set_app_details2_is_open} 
                addAppointmentFunction={addAppointmentFunction}
                // app_patient_name={app_patient_name} set_app_patient_name={set_app_patient_name}
                app_date={app_date} set_app_date={set_app_date}
                app_patient_list={app_patient_list} 
                app_patient_id={app_patient_id} set_app_patient_id={set_app_patient_id}
                // app_user_doctor_name={app_user_doctor_name} set_app_user_doctor_name={set_app_user_doctor_name}
                app_user_doctor_id={app_user_doctor_id} set_app_user_doctor_id={set_app_user_doctor_id}
                app_start_time={app_start_time} set_app_start_time={set_app_start_time} 
                app_proc_name={app_proc_name} set_app_proc_name={set_app_proc_name}
                app_proc_duration_minutes={app_proc_duration_minutes} set_app_proc_duration_minutes={set_app_proc_duration_minutes}
                app_proc_fields={app_proc_fields} set_app_proc_fields={set_app_proc_fields}
                app_end_time={app_end_time} set_app_end_time={set_app_end_time} 
                app_status={app_status} set_app_status={set_app_status}
                app_total_proc_duration_minutes={app_total_proc_duration_minutes} set_app_total_proc_duration_minutes={set_app_total_proc_duration_minutes}
                app_type={app_type} set_app_type={set_app_type}
                app_total_proc_cost={app_total_proc_cost} set_app_total_proc_cost={set_app_total_proc_cost}
                app_pay_amount={app_pay_amount} set_app_pay_amount={set_app_pay_amount}
                app_pay_balance={app_pay_balance} set_app_pay_balance={set_app_pay_balance}
                app_pay_change={app_pay_change} set_app_pay_change={set_app_pay_change}
                app_user_doctor_list={app_user_doctor_list}
                app_pay_date={app_pay_date} set_app_pay_date={set_app_pay_date}
                app_patient_name_id={app_patient_name_id}
                app_user_doctor_name_id={app_user_doctor_name_id}
                app_proc_fields2={app_proc_fields2}

            ></AppointmentDetailsUpdate> */}
            
            <div className='table-table2-table'>
                <thead className='table-table2-table-thead-search2'>
                    <tr className='table-table2-table-thead-tr-search2'>
                      
                        <th><input placeholder='Name' value={app_search_patient_name} onChange={(e)=>{set_app_search_patient_name(e.target.value)}}/></th>
                        <th><input placeholder='Doctor' value={app_search_user_doctor_name} 
                                onChange={(e)=>{set_app_search_user_doctor_name(e.target.value)}}/>
                            <button onClick={()=>{
                                set_app_search_patient_name('');set_app_search_user_doctor_name('')
                                set_app_search_date('');
                                }}>X</button>
                        </th>
                        
                        <th>
                            {/* <input placeholder='Date' value={app_search_type} onChange={(e)=>{set_app_search_type(e.target.value)}}/> */}
                            <DatePicker 
                                // minDate={new Date()} 
                                yearDropdownItemNumber={90} 
                                showYearDropdown 
                                scrollableYearDropdown={true} 
                                // dateFormat='MMMM d, yyyy' 
                                // dateFormat="dd-MMM-yyyy"
                                dateFormat="dd-MMM"
                                // className='date-picker' 
                                placeholderText="Date" 
                                selected={app_search_date} 
                                onChange={date=>set_app_search_date(date)} />
                        </th>
                        <th><p onClick={()=>{getAppointments({
                            app_search_patient_name, 
                            app_search_user_doctor_name, 
                            app_search_date
                            // : app_search_date === ''? '' : new Date(app_search_date).toLocaleString().split(',')[0]
                            : app_search_date === ''? '' : formatDateYYYYMMDD(app_search_date)
                            ,
                            })}}>Find</p></th>
                        <th><p onClick={()=>newAppointment()}>New</p></th>
                        
                    </tr>
                </thead>
                <thead className='table-table2-table-thead'>
                    <tr className='table-table2-table-thead-tr'>
                        
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>No</th>
                    </tr>
                </thead>
                <tbody className='table-table2-table-tbody'>
                    
                    {appointmentsData && appointmentsData.map((appointment, index)=>{
                        
                        return (
                            <tr key={index} className='table-table2-table-tbody-tr'>
                               
                                <td>{appointment.patient_name}</td>
                                <td>{appointment.user_name}</td>
                                <td className='maxW50px'>{formatDate(appointment.app_date)}</td>
                                <td className='table-table2-table-body-tr-td '>
                                    <button className='minW50px' style={{background:'#3c3f44'}} onClick={()=>{}}>{
                                    // new Date(appointment.app_start_time).toTimeString().split(' ')[0].slice(0, new Date(appointment.app_start_time).toTimeString().split(' ')[0].length - 3)
                                    new Date(appointment.app_start_time).toLocaleString('en-PH', timeOptions)
                                    }</button>
                                </td>
                                <td className='table-table2-table-body-tr-td'>
                                    <button className='minW50px' onClick={()=>{}}>{
                                        new Date(appointment.app_end_time).toLocaleString('en-PH', timeOptions)
                                    // new Date(appointment.app_end_time).toTimeString().split(' ')[0].slice(0, new Date(appointment.app_end_time).toTimeString().split(' ')[0].length - 3)
                                    }</button>
                                </td>
                                <td><button style={{background:'#e9115bf0'}} onClick={()=>{AppointmentDetailsFunction(appointment.app_id, appointment.patient_name)}}>{index+1}</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </div>

        </div>
    )
}

export default AppointmentTable;
