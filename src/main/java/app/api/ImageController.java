package app.api;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import app.api.access.AccessManager;
import app.api.dto.LoginDto;
import app.api.dto.Token;
import app.api.dto.UserDtoIn;
import app.api.dto.UserDtoOut;
import app.dao.ImageDAO;
import app.dao.UserDAO;
import app.model.Image;
import app.model.User;


@Path("/image")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ImageController {

	@Inject
	private UserDAO userDAO;
	@Inject
	private ImageDAO imageDAO;
	
	@Inject
	private AccessManager accessManager;
	

    @GET
    @Path("/{userId}")
	public Response getImage(@PathParam("userId") int userId, @QueryParam("token") UUID uuid) 
	{
    	System.out.println("getImagebyUserID");
		if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		Image Bild = imageDAO.getImage(userId);
		
 		if(Bild != null)
		{
			return Response.ok()
					.entity(Bild.getImage_data())
					.type(Bild.getContent_type()).build();
		}
		else
		    throw new RuntimeException("ERROR: Image not found");
	}
    @GET
	public Response getImagebyID(@QueryParam("imageId") int imageId, @QueryParam("token") UUID uuid) 
	{
    	System.out.println("getImagebyImageID"+imageId);
    	if( accessManager.hasAccess(uuid) == false )
		{
			throw new RuntimeException("ERROR: Access not granted");
		}
		Image Bild = imageDAO.getImagebyId(imageId);
		
 		if(Bild != null)
		{
			return Response.ok()
					.entity(Bild.getImage_data())
					.type(Bild.getContent_type()).build();
		}
		else
		    throw new RuntimeException("ERROR: Image not found");
	}
}