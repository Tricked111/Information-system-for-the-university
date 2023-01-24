import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import TerminsTable from '../../Components/TerminsTable/TerminsTable';
import Button from 'react-bootstrap/Button';
import createRequest from '../../Services/CreateRequest';
import './CourseTermins.scss'
import { LoggedUserContext } from '../../Context/LoggedUser';
import AddTerminModal from '../../Components/AddTerminModal/AddTerminModal';

const CourseTermins = () => {
    const {id} = useParams();
    const [termins, setTermins] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const [addTerminModalOpened, setAddTerminModalOpened] = useState(false)

    useEffect(()=> {
        if (termins.length === 0) {
            setIsLoading(true);
            if (loggedUser.id_person) {
                const path = loggedUser.role === 's' ?
                '/get-courses-by-user-id/' + loggedUser.id_person :
                '/get-termins-by-course-id/' + id

                createRequest({
                    path: path,
                    method: 'GET'
                })
                .then(res => res.json())
                .then(res => {
                    const termins = loggedUser.role === 's' ?
                    res.find(el => el.id_course === parseInt(id)).termins :
                    res
                    setIsLoading(false)
                    setTermins(termins)
                })
                .catch(err => {
                    console.error(err)
                    setIsLoading(false)
                })
            }
        }
    }, [loggedUser])

    const onAddTermin = (newTermin) => {
        setTermins(prev => [...prev, newTermin])
    }

    const onChangeTermin = (editedTermin) => {
        console.log(editedTermin)
        setTermins(prev => prev.map(el => editedTermin.id_termin === el.id_termin ? editedTermin : el))
    }

    const onDeleteTermin = (editedTermin) => {
        setTermins(prev => {
            return prev.filter(el => el.id_termin !== editedTermin.id_termin)
        })
    }

    console.log(termins)
    return(
        <>
            {isLoading ?
            <div className='text-center'>
                <LoadingIcon/>
            </div>
            :
            <>
                <h4>Lectures</h4>
                <TerminsTable termins={termins.filter(el => el.repeted)} repeated onChangeSideEffect={onChangeTermin} onDeleteTermin={onDeleteTermin}/>
                <h4>Other</h4>
                <TerminsTable termins={termins.filter(el => !el.repeted)} onChangeSideEffect={onChangeTermin} onDeleteTermin={onDeleteTermin}/>
                {(loggedUser.role === 'a' || loggedUser.role === 'g') &&
                    <>
                        <Button onClick={() => {setAddTerminModalOpened(true)}}> Add termin </Button>
                        <AddTerminModal setModalOpen={setAddTerminModalOpened} isModalOpen={addTerminModalOpened} sideEffectOnChange={onAddTermin}/>
                    </>
                }
            </>}

        </>
    )
}

export default CourseTermins