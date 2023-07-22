import React from "react";

import Title from '../../components/Title';

import Input from '../../components/Input';
import LoginButton from '../../components/LoginButton';
import RegisterButton from '../../components/RegisterButton';

const DetailLogin = () => {
  return (
    <>
      <Title title='로그인'/>
      
      <Input placeholder="이메일을 입력하세요" />

      <Input placeholder="비밀번호를 입력하세요" />

      <LoginButton />
      <RegisterButton />
    </>
  );
};

export default DetailLogin;