import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const handleClick = () => {
    setShow((prev) => !prev);
  };
  const toast = useToast();
  const navigate = useNavigate();

  const submitReset = async () => {
    setLoading(true);
    if (!email || !password || !confirmpassword) {
      toast({
        title: "All fields are required!!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/user/reset-password",
        { email, password },
        config
      );
      toast({
        title: "Password has been updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Something Happend!!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          fontSize={"4xl"}
          fontWeight={"600"}
          fontFamily={"Work sans"}
          color={"#1B4242"}
          textAlign={"center"}
        >
          Reset Password
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        color={"black"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <FormControl id="email" isRequired>
          <FormLabel> Email </FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>New Password </FormLabel>
          <InputGroup size={"md"}>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
              <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Confirm New Password </FormLabel>
          <InputGroup size={"md"}>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
              <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitReset}
          isLoading={loading}
        >
          Submit
        </Button>
        <Button
          colorScheme="white"
          borderColor={"blue"}
          color={"black"}
          width={"100%"}
          style={{ marginTop: 15 }}
          isLoading={loading}
        >
          <Link to="..">Back</Link>
        </Button>
      </Box>
    </Container>
  );
}

export default ResetPassword;
