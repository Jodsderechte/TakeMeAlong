package app.dao;

import java.util.List;
import java.util.Optional;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import app.model.Image;
import app.model.User;



public class ImageDAO {
	@PersistenceContext(name = "jpa-unit")
    EntityManager em;
	
	@Inject
	private UserDAO userDAO;
	

	
	public Image getImage(int user_id) {
		User user = userDAO.findUser(user_id).get();
		Image image = em.find(Image.class, user.getImageId());
		System.out.println(image);
		return image;
	}
	
	public Image getImagebyId(int image_id) {
		Image image = em.find(Image.class, image_id);
		System.out.println(image.getImageId());
		return image;
	}

	public int addImage(byte[] content) {
				System.out.println("addImage"+content.toString());
				Image image = new Image();
				image.setImage_data(content);
				image.setContent_type("image/jpeg");
				
				em.persist(image);
				em.flush();
				em.refresh(image);
				return image.getImageId();
		
	}
}
