import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Modal from './Modal.js';
import './PatientTable.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PrintTable.module.css';

const PatientTable = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [nameInput, setNameInput] = useState('');
    const [mobileInput, setMobileInput] = useState('');
    const [genderInput, setGenderInput] = useState('');
    const [selectedDateInput, setSelectedDatenput] = useState(new Date());
    const [allergenInput, setAllergenInput] = useState('');
    // const dateInput = useRef();
    useEffect(()=>{
        
        getUsers(); 
    
    }, []);

    const getUsers = async ()=>{
        const response = await axios.get('http://172.16.0.101:3001/patient');
  
        if (response.data) {
            console.log('response data',response.data)
            setData(response.data);
        }
    };

    console.log('patient table fecth data',data);
    // console.log('name: ', nameInput);
    // console.log('mobile: ', mobileInput);
    // console.log('gender: ', genderInput);
    // console.log('dob: ', selectedDateInput);
    // console.log('allergen: ', allergenInput);

    

    const addPatient = async ()=>{
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
        
            return [year, month, day].join('-');
        }        
        let date = formatDate(selectedDateInput);
        // console.log('date: ', date);
        // console.log('addPatient called');
        if (!nameInput || !mobileInput || !genderInput || !selectedDateInput || !allergenInput) {
            alert('Empty field/s')
        }else{
            const response = await axios.post("http://172.16.0.101:3001/patient", {
            name: nameInput,
            mobile: mobileInput,
            gender: genderInput,
            dob: date,
            allergen: allergenInput,
            status_: 'Active',
        });
        console.log('add patient response.data', response.data)
        if (response.data.insertOk) {
            alert('Patient Added');
            // setSelectedDatenput(new Date());
            // setNameInput('');
            // setMobileInput('');
            // setAllergenInput('');
            // setGenderInput('');
            // console.log('clearing input name', nameInput);
            setIsOpen(false);
        }else{
            alert('Failed Adding Patient');
        }
        }
        
    }
    // console.log('dateInpu.current: ', dateInput.current);
    return (
        <div className='patient-table-container'>
            <Modal className='modal-container' open={isOpen} onClose={()=>{setIsOpen(false); setSelectedDatenput(new Date())}} >
                <div className="container">
                    <div className="title">Adding Patient</div>
                    <div className="content">
                    <div className='form'>
                        <div className="user-details">
                            <div className="input-box ">
                                <span className="details">Date of Birth</span>
                                <DatePicker maxDate={new Date()} yearDropdownItemNumber={90} showYearDropdown scrollableYearDropdown={true} dateFormat='yyyy/MM/dd' className='date-picker' placeholder="Enter Date of Birth" selected={selectedDateInput} onChange={date=>setSelectedDatenput(date)}/>
                            </div>
                            <div className="input-box">
                                <span className="details">Full Name</span>
                                <input type="text" placeholder="Enter name" value={nameInput} required onChange={e=>setNameInput(e.target.value)} />
                            </div>
                            <div className="input-box">
                                <span className="details">Mobile</span>
                                <input type="text" placeholder="Enter mobile" value={mobileInput} required onChange={e=>setMobileInput(e.target.value)}/>
                            </div>                       
                            <div className="input-box">
                                <span className="details">Allergen</span>
                                <input type="text" placeholder="Enter allergens" value={allergenInput} required onChange={e=>setAllergenInput(e.target.value)}/>
                            </div>
                        </div>
                        <div className="gender-details">
                            <input type="radio" name="gender" id="dot-1" value="male" onChange={e=>setGenderInput(e.target.value)}/>
                            <input type="radio" name="gender" id="dot-2" value="female" onChange={e=>setGenderInput(e.target.value)}/>
                            <span className="gender-title">Gender</span>
                            <div className="category">
                                <label htmlFor="dot-1">
                                    <span className="dot one"></span>
                                    <span className="gender">Male</span>
                                </label>
                                <label htmlFor="dot-2">
                                    <span className="dot two"></span>
                                    <span className="gender">Female</span>
                                </label>
                            </div>
                        </div>
                        <div className="button">
                        <input type="submit" onClick={addPatient} value="Add Patient" />
                        {/* <button className='modal-button-add-patient' onClick={addPatient}>Add Patient</button> */}
                        </div>
                    </div>
                    </div>
                </div>
            </Modal>
            {/* <div className="container">
                <table className="responsive-table">
                    <input type='text'/>
                    <caption>Patient's Table</caption>
                    
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Age</th>
                        <th scope="col">Allergen</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <td colspan="7">Sources: <a href="http://en.wikipedia.org/wiki/List_of_highest-grossing_animated_films" rel="external">Wikipedia</a> &amp; <a href="http://www.boxofficemojo.com/genres/chart/?id=animation.htm" rel="external">Box Office Mojo</a>. Data is current as of March 31, 2021.</td>
                    </tr>
                    </tfoot>
                    <tbody>
                        <tr>
                            <th scope="row">Benar Isais 1</th>
                            <td data-title="Mobile">09569346664</td>
                            <td data-title="Gender">Male</td>
                            <td data-title="Age" >42</td>
                            <td data-title="Allergen">None</td>
                        </tr>
                        <tr>
                            <th scope="row">Benar Isais 1</th>
                            <td data-title="Released">09569346664</td>
                            <td data-title="Studio">Male</td>
                            <td data-title="Worldwide Gross" data-type="currency">42</td>
                            <td data-title="Domestic Gross" data-type="currency">None</td>
                        </tr>
                        <tr>
                            <th scope="row">Benar Isais 1</th>
                            <td data-title="Released">09569346664</td>
                            <td data-title="Studio">Male</td>
                            <td data-title="Worldwide Gross" data-type="currency">42</td>
                            <td data-title="Domestic Gross" data-type="currency">None</td>
                        </tr>
                       
                    </tbody>
                </table>
            </div> */}

            <div className='patient-table-content-container'>
                <div className='patient-table-head-container'>
                    <h1 className='patient-table-heading'>Patient Table</h1>
                    <div className='patient-table-head-input'>
                        <div className='patient-table-head-search'>
                            <button className='patient-table-button-search'>Search</button>
                            <input className='patient-table-search-input' type='text' placeholder='Search'/>
                        </div>
                        <div className='patient-table-button-add-container'>
                        <button className='patient-table-button-add' onClick={()=>setIsOpen(true)}>New Patient</button><br/>
                        </div>
                        
                    </div>
                    
                </div>
                
                

                <table className='patient-table-table'>
                    <thead className='patient-table-table-thead'>
                        <tr className='patient-table-table-thead-tr'>
                            <th >Name</th>
                            <th>Mobile</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Allergen</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label='Name'>Benar Isais</td>
                            <td data-label='Mobile'>09569346661</td>
                            <td data-label='Gender'>Male</td>
                            <td data-label='Age'>42</td>
                            <td data-label='Allergen'>None</td>
                            <td data-label='Status'>Active</td>
                            <td data-label='Edit'>
                                <button className='patient-table-button-edit'>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-label='Name'>Benar Isais</td>
                            <td data-label='Mobile'>09569346661</td>
                            <td data-label='Gender'>Male</td>
                            <td data-label='Age'>42</td>
                            <td data-label='Allergen'>None</td>
                            <td data-label='Status'>Active</td>
                            <td data-label='Edit'>
                                <button className='patient-table-button-edit'>Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td data-label='Name'>Benar Isais</td>
                            <td data-label='Mobile'>09569346661</td>
                            <td data-label='Gender'>Male</td>
                            <td data-label='Age'>42</td>
                            <td data-label='Allergen'>None</td>
                            <td data-label='Status'>Active</td>
                            <td data-label='Edit'>
                                <button className='patient-table-button-edit'>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}

export default PatientTable
