package takeMeAlong;

import java.util.UUID;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import takeMeAlong.api.access.AccessManager;
import takeMeAlong.api.dto.LoginDto;
import takeMeAlong.api.dto.Token;
import takeMeAlong.api.dto.UserDtoIn;
import takeMeAlong.dao.UserDAO;

/**
 *
 */
@ApplicationPath("/access")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class TakeMeAlongRestApplication extends Application {

	@Inject
	private UserDAO userDAO;

	@Inject
	private AccessManager accessManager;

	@GET
	public Token login(LoginDto loginDto) {
		try {
			UUID uuid = accessManager.register(loginDto.getUsername(), loginDto.getPassword());

			System.out.println("Login : " + loginDto.getUsername());
			System.out.println("  -> " + uuid);

			return new Token(uuid);
		} catch (Throwable thr) {
			throw new RuntimeException("ERROR: login");
		}
	}

	@DELETE
	public Response logout(@QueryParam("token") String token) {
		
		System.out.println("Token: " + token);
		String username = accessManager.getUsername(UUID.fromString(token));	
		System.out.println("Logout: " + username);
		
		return accessManager.deregister(username) ? Response.ok().build() : Response.status(404).build();
	}

	@POST
	@Transactional
	public Token register(UserDtoIn user) {

		userDAO.createUser(user.getUsername(), user.getPassword(), user.getFirstname(), 
				user.getLastname(), user.getEmail(), user.getStreet(), user.getStreetNumber(), user.getZip(), user.getCity());

		UUID uuid = accessManager.register(user.getUsername(), user.getPassword());
		
		return new Token(uuid);
	}

}
