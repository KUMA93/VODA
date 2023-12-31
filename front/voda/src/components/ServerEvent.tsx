import React, {useEffect, useState} from 'react';
import { API_URL } from '../constants/url';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import HandleButton from './HandleBtn';

import { receiveCalling, rejectCalling } from '../apis/calling';

// callInfoType, 
import { updateCall, setIsRejectCall } from '../store/callSlice';
import { styled } from 'styled-components';
import AlarmAudio from './AlarmAudio';
import { userSliceLogout } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHook';
import useErrorHandlers from '../hooks/useError';


const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 15%;
  margin-left: 15%;
  align-items: center;
  text-align: center;
`;

const SimpleModal = {
  overlay: {
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#001d3d',
  },
}

const DetailModal = {
  overlay: {
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#fff',
  },
}


export default function SseComponent() {
	const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const errorHandlers = useErrorHandlers();

  const [content, setContent] = useState('');
  const [callNo, setCallNo] = useState(0);
  const [isCallModalOpen, setisCallModalOpen] = useState(false);
  const [isReject, setIsReject] = useState(false); //통화거절

  const userEmail = useAppSelector((state) => state.user.userInfo.userEmail);
  const [alarm, setAlarm] = useState(getNotificaationPermission());

  let eventSource: EventSource = null;

  useEffect(() => {
    if(userEmail === null || userEmail === ''){
      if(eventSource &&  eventSource.readyState !== eventSource.CLOSED){
        console.log("sse 연결 끊김");
        eventSource.close();
      }
      return;
    }
    eventSource = new EventSource(`${API_URL}/subscribe/${userEmail}`);

    eventSource.addEventListener("connection", (event) => {
      console.log("SSE 연결 완료");
    });
    
    eventSource.addEventListener("call", (event) => {
      //카메라가 로드되는 것을 고려해서 4초 지연 후 알림
      setTimeout(() => {
        setisCallModalOpen(true);
        const response = JSON.parse(event.data);
        dispatch(updateCall({
          sessionToken : response.token,
          sessionId : response.sessionId,
          callNo : response.callNo,
        }));
        setContent(response.content);
        setCallNo(response.callNo);
        if(alarm){
          new Notification("VODA", {body: `${response.content}`});
        }
      }, 2000); 
    });
    
    eventSource.addEventListener("reject", (event) => {
      setisCallModalOpen(false);
      setIsReject(true);
      console.log(event);
      // 통화 거절 추가 로직
      const response = JSON.parse(event.data);
      setContent(response.content);
      setCallNo(response.callNo);
    });
    eventSource.addEventListener("logout", (event) => {
      console.log("강제 로그아웃");
      if(eventSource && eventSource.readyState !== eventSource.CLOSED){
        console.log("sse 연결 끊김");
        eventSource.close();
      }
      dispatch(userSliceLogout());
      navigate('/');
      alert("다른 곳에서 로그인 하여 접속이 종료되었습니다.");
    });

    return () => {
      if(userEmail === null || userEmail === ''){
        if(eventSource &&  eventSource.readyState !== eventSource.CLOSED){
          console.log("sse 연결 끊김");
          eventSource.close();
        }
      }
    }
  }, [userEmail]);

	function redirectVideo(){
		navigate('/video');
	}

	function acceptCall(){
    receiveCalling(callNo)
    .then((res)=>{
      setisCallModalOpen(false);
      redirectVideo();
    })
    .catch((err)=> {
      errorHandlers(err.response, acceptCall);
    });
	}

  function rejectCall() {
    rejectCalling(callNo)
    .then((res) => {
      setisCallModalOpen(false);
    })
    .catch((err) => {
      errorHandlers(err.response, rejectCall);
    })
  }

  function getNotificaationPermission() {
    if("Notification" in window){
      Notification.requestPermission();
      if(Notification.permission === "granted") return true;
      else return false;
    }else{
      console.log("알림을 지원하지 않는 브라우저입니다.");
      return false;
    }
  }

  function exitcall() {
    dispatch(setIsRejectCall(true));
    setIsReject(false);
    navigate('/home');
  }

  return (
    <>
      <AlarmAudio playing = {isCallModalOpen}/>
      {isReject ? (
        <Modal id="callModal"
        isOpen={isReject} 
        onRequestClose={(e) => setIsReject(false)}
        ariaHideApp={false}
        style={localStorage.getItem('theme') === 'detail' ? DetailModal : SimpleModal}
        shouldCloseOnOverlayClick={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: 'xx-large', margin: '5%' }}>{content}</p>
          <ButtonContainer>
            <HandleButton text='나가기' onClick={exitcall} />
          </ButtonContainer>
        </div>
      </Modal>
      ) : (
        <Modal id="callModal"
        isOpen={isCallModalOpen} 
        onRequestClose={(e) => setisCallModalOpen(false)}
        ariaHideApp={false}
        style={localStorage.getItem('theme') === 'detail' ? DetailModal : SimpleModal}
        shouldCloseOnOverlayClick={false}
      >
        <p style={{textAlign: 'center', fontSize: 'xx-large', margin: '5%'}}>{content}</p>
        <ButtonContainer>
          <HandleButton text='통화 받기' onClick={acceptCall} />
          <HandleButton text='통화 거절' onClick={rejectCall} />
        </ButtonContainer>
      </Modal>
      )}
      

    </>
    )
}