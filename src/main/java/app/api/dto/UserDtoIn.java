package app.api.dto;

import java.io.InputStream;
import java.io.Serializable;


@SuppressWarnings("serial")
public class UserDtoIn implements Serializable {
	private String username;
	private String password;
	private String firstname;
	private String lastname;
	private String email;
	private String street;
	private String streetNumber;
	private String zip;
	private String city;
	private InputStream profileImage;
	
	public UserDtoIn()
	{
	
	}
	public InputStream getprofileImage() {
		return profileImage;
	}


	public void setprofileImage(InputStream profileImage) {
		this.profileImage = profileImage;
	}
	
	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
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
	@Override
	public String toString() {
		return "UserDtoIn [username=" + username + ", password=" + password + ", firstname=" + firstname + ", lastname="
				+ lastname + ", email=" + email + ", street=" + street + ", streetNumber=" + streetNumber + ", zip="
				+ zip + ", city=" + city + ", profileImage=" + profileImage + "]";
	}
	
	
}
