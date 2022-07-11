package app.api.dto;

import java.io.Serializable;

import app.model.User;

@SuppressWarnings("serial")
public class UserDtoOut implements Serializable {
	private String username;
	private String firstname;
	private String lastname;
	private String email;
	private String street;
	private String streetNumber;
	private String zip;
	private String city;
	private Integer userId;
	
	public UserDtoOut()
	{
	
	}
	
	public UserDtoOut(User user)
	{
		this.username = user.getUsername();
		this.firstname = user.getFirstname();
		this.lastname = user.getLastname();
		this.email = user.getEmail();
		this.street = user.getStreet();
		this.streetNumber = user.getStreetNumber();
		this.zip = user.getZip();
		this.city = user.getCity();
		this.userId=user.getUserId();
		
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getStreetNumber() {
		return streetNumber;
	}
	public void setStreetNumber(String streetNumber) {
		this.streetNumber = streetNumber;
	}
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	
	
}
