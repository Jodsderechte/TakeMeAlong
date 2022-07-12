package app.api;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import app.api.access.AccessManager;
import app.api.dto.Token;
import app.api.dto.UserDtoIn;
import app.api.dto.UserDtoOut;
import app.dao.UserDAO;
import app.model.User;
import javax.transaction.Transactional;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController
{
	
	@Inject
	private UserDAO userDAO;
	
	@Inject
	private AccessManager accessManager;
	

    @GET
    @Path("/{userId}")
	public UserDtoOut getUser(@PathParam("userId") int userId, @QueryParam("token") UUID uuid) 
	{
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		
		Optional<User> optUser = userDAO.findUser(userId);
		if( optUser.isPresent() )
		{
			UserDtoOut userDto = new UserDtoOut(optUser.get());
			return userDto;
		}
		else
		    throw new RuntimeException("ERROR: User not found");
	}
	
    @DELETE
    @Transactional
	public boolean deleteUser(@QueryParam("token") UUID uuid)
	{
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		
		String username = accessManager.getUsername(uuid);
		
		if( userDAO.deleteUser(username) )
		{
			accessManager.deregister(username);
			return true;
		}
		else
		{
			return false;
		}
	}

    @GET
	public List<UserDtoOut> findUsersNearby(@QueryParam("distance") int distance, @QueryParam("token") UUID uuid) {
		
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		
		String username = accessManager.getUsername(uuid);
		User user = userDAO.findUser(username).get();
		
		List<User> users = userDAO.findUserNearBy(user.getPosition(), distance);
		users.remove(user);
		return users.stream().map( UserDtoOut::new ).collect(Collectors.toList() );
	}
    
	@POST
	@Transactional
	public Token register(UserDtoIn user) {
		System.out.println(user);
		userDAO.createUser(user.getUsername(), user.getPassword(), user.getFirstname(), 
				user.getLastname(), user.getEmail(), user.getStreet(), user.getStreetNumber(), user.getZip(), user.getCity(), Integer.parseInt(user.getImageId()));

		UUID uuid = accessManager.register(user.getUsername(), user.getPassword());
		
		return new Token(uuid);
	}
}
