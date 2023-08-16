// import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

// import SimpleTitle from '../../components/SimpleTitle';
import BoardList from '../../components/board/BoardList';
// import WriteButton from '../../components/board/WriteButton';
import { Link } from "react-router-dom";

import { MdAssignmentAdd } from 'react-icons/md'
import FroClientImg from "../../assets/images/ForClient.jpg"

const StyledLink = styled(Link)<StyledLinkProps>`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

interface StyledLinkProps {
  to: string;
  text?: string;
  title: string;
  children: React.ReactNode;
}


const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const SimpleFeedBack = () => {

    const navigate = useNavigate();

    const handleWriteArticle= () => {
        navigate('/write');
    }

    return (
        <>
            <ListContainer>
              <img src={ FroClientImg } alt="" />
              <div>
                <div style={{ fontSize: '1.4vw', display:'flex', justifyContent:'flex-end', marginTop: '40px', position:'relative', }}>
                  <MdAssignmentAdd onClick={handleWriteArticle} aria-label='새 글 작성하기' style={{ cursor:'pointer' }}/>
                  &nbsp;&nbsp; <StyledLink title='NewPost' to='/write'> 새 글 작성하기</StyledLink>
                  </div>
                <div style={{ padding: '67px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BoardList />
                </div>
              </div>
            </ListContainer>



        </>
    );
};

export default SimpleFeedBack;
