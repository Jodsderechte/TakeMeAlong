package takeMeAlong.api.dto;

import java.io.Serializable;

@SuppressWarnings("serial")
public class LoginDto implements Serializable
{
	String username; 
	String password;
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
