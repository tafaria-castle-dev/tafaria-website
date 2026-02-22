"use client";
import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import styled from "styled-components";
import { MdMailOutline } from "react-icons/md";
import { BiPhone } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", formData);
      setIsSubmitted(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <FormSection>
          <Form>
            <InputGroup>
              <Input
                type="text"
                name="name"
                placeholder="NAME"
                value={formData.name}
                onChange={handleInputChange}
                hasError={!!errors.name}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Input
                type="email"
                name="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={handleInputChange}
                hasError={!!errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                name="subject"
                placeholder="SUBJECT"
                value={formData.subject}
                onChange={handleInputChange}
                hasError={!!errors.subject}
              />
              {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <Textarea
                name="message"
                placeholder="MESSAGE"
                value={formData.message}
                onChange={handleInputChange}
                hasError={!!errors.message}
              />
              {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
            </InputGroup>

            <SendButton
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </SendButton>

            {isSubmitted && (
              <SuccessMessage>
                Thank you! Your message has been sent successfully.
              </SuccessMessage>
            )}
          </Form>
        </FormSection>

        <InfoSection>
          <HorizontalWrapper>
            <IconWrapper>
              <BiPhone color="#fff" size="16" />
            </IconWrapper>
            <a href="tel:070015000"> 0700 151 480</a>
          </HorizontalWrapper>
          <HorizontalWrapper>
            <IconWrapper>
              <MdMailOutline color="#fff" size="16" />
            </IconWrapper>
            <a href="mailto:info@tafaria.com" target="_blank">
              info@tafaria.com
            </a>
          </HorizontalWrapper>
          <HorizontalWrapper>
            <IconWrapper>
              <IoLocationOutline color="#fff" size="16" />
            </IconWrapper>
            <a
              href="https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z?hl=en&entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
            >
              <h4>
                1910 Park Rise, off Asunder Road on Deighton Downs Avenue off
                Nyeri/Nyahururu Road
              </h4>
            </a>
          </HorizontalWrapper>
          <HorizontalWrapper>
            <a href={`https://wa.me/+254791480876?text=Hello`} target="_blank">
              <IconWrapper>
                <FaWhatsapp color="#fff" size="16" />
              </IconWrapper>
            </a>
            <a href={`https://wa.me/+254708877244?text=Hello`} target="_blank">
              (+254) 708877244
            </a>
          </HorizontalWrapper>
        </InfoSection>
      </ContentWrapper>
      {/* <MapSection>
        <MapIframe
          src="https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z?hl=en&entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D"
          style={{ border: 0 }}
          loading="lazy"
        />
      </MapSection> */}
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  background-color: #f5f0e6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  a,
  h4 {
    color: #902729;
  }
`;

const IconWrapper = styled.div`
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  background-color: #902729;
  border-radius: 50%;
  margin-right: 20px;
  flex-shrink: 0;
  @media screen and (max-width: 800px) {
    width: 30px;
    height: 30px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FormSection = styled.div`
  flex: 1;
  min-width: 300px;
  margin-right: 20px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

interface StyledTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}
const Input = styled.input<StyledInputProps>`
  padding: 15px;
  font-size: 1rem;
  border: 2px solid ${(props) => (props.hasError ? "#e74c3c" : "#e0e0e0")};
  border-radius: 8px;
  outline: none;
  background-color: #fff;
  transition: all 0.3s ease;
  font-family: inherit;
  color: #902729;
  caret-color: #333;

  &:focus {
    border-color: ${(props) => (props.hasError ? "#e74c3c" : "#902729")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(231, 76, 60, 0.1)" : "rgba(144, 39, 41, 0.1)"};
    caret-color: #902729; /* Ensure cursor is visible on focus */
  }

  &::placeholder {
    color: #999;
    font-weight: 300;
  }

  &:hover {
    border-color: ${(props) => (props.hasError ? "#e74c3c" : "#bbb")};
  }
`;

const Textarea = styled.textarea<StyledTextareaProps>`
  padding: 15px;
  font-size: 1rem;
  border: 2px solid ${(props) => (props.hasError ? "#e74c3c" : "#e0e0e0")};
  border-radius: 8px;
  outline: none;
  background-color: #fff;
  height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  color: #902729;
  &:focus {
    border-color: ${(props) => (props.hasError ? "#e74c3c" : "#902729")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(231, 76, 60, 0.1)" : "rgba(144, 39, 41, 0.1)"};
  }

  &::placeholder {
    color: #999;
    font-weight: 300;
  }

  &:hover {
    border-color: ${(props) => (props.hasError ? "#e74c3c" : "#bbb")};
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 2px;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  text-align: center;
  font-weight: 500;
`;

const SendButton = styled.button`
  padding: 18px;
  background-color: #902729;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background-color: #7a1f21;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(144, 39, 41, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media screen and (max-width: 800px) {
    margin-top: 30px;
  }
`;

// const MapSection = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   height: 400px;
// `;

// const MapIframe = styled.iframe`
//   width: 100%;
//   height: 100%;
// `;

export default ContactPage;
