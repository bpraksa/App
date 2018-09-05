package com.praksa.breza.web.rest;

import com.praksa.breza.BrezaApp;

import com.praksa.breza.domain.OnlineOrder;
import com.praksa.breza.domain.City;
import com.praksa.breza.domain.Client;
import com.praksa.breza.repository.OnlineOrderRepository;
import com.praksa.breza.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.praksa.breza.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the OnlineOrderResource REST controller.
 *
 * @see OnlineOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrezaApp.class)
public class OnlineOrderResourceIntTest {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Double DEFAULT_TOTAL_PRICE = 1D;
    private static final Double UPDATED_TOTAL_PRICE = 2D;

    @Autowired
    private OnlineOrderRepository onlineOrderRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restOnlineOrderMockMvc;

    private OnlineOrder onlineOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OnlineOrderResource onlineOrderResource = new OnlineOrderResource(onlineOrderRepository);
        this.restOnlineOrderMockMvc = MockMvcBuilders.standaloneSetup(onlineOrderResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OnlineOrder createEntity(EntityManager em) {
        OnlineOrder onlineOrder = new OnlineOrder()
            .address(DEFAULT_ADDRESS)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .totalPrice(DEFAULT_TOTAL_PRICE);
        // Add required entity
        City city = CityResourceIntTest.createEntity(em);
        em.persist(city);
        em.flush();
        onlineOrder.setCity(city);
        // Add required entity
        Client client = ClientResourceIntTest.createEntity(em);
        em.persist(client);
        em.flush();
        onlineOrder.setClient(client);
        return onlineOrder;
    }

    @Before
    public void initTest() {
        onlineOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createOnlineOrder() throws Exception {
        int databaseSizeBeforeCreate = onlineOrderRepository.findAll().size();

        // Create the OnlineOrder
        restOnlineOrderMockMvc.perform(post("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrder)))
            .andExpect(status().isCreated());

        // Validate the OnlineOrder in the database
        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeCreate + 1);
        OnlineOrder testOnlineOrder = onlineOrderList.get(onlineOrderList.size() - 1);
        assertThat(testOnlineOrder.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testOnlineOrder.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testOnlineOrder.getTotalPrice()).isEqualTo(DEFAULT_TOTAL_PRICE);
    }

    @Test
    @Transactional
    public void createOnlineOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = onlineOrderRepository.findAll().size();

        // Create the OnlineOrder with an existing ID
        onlineOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOnlineOrderMockMvc.perform(post("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrder)))
            .andExpect(status().isBadRequest());

        // Validate the OnlineOrder in the database
        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = onlineOrderRepository.findAll().size();
        // set the field null
        onlineOrder.setAddress(null);

        // Create the OnlineOrder, which fails.

        restOnlineOrderMockMvc.perform(post("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrder)))
            .andExpect(status().isBadRequest());

        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = onlineOrderRepository.findAll().size();
        // set the field null
        onlineOrder.setPhoneNumber(null);

        // Create the OnlineOrder, which fails.

        restOnlineOrderMockMvc.perform(post("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrder)))
            .andExpect(status().isBadRequest());

        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOnlineOrders() throws Exception {
        // Initialize the database
        onlineOrderRepository.saveAndFlush(onlineOrder);

        // Get all the onlineOrderList
        restOnlineOrderMockMvc.perform(get("/api/online-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(onlineOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].totalPrice").value(hasItem(DEFAULT_TOTAL_PRICE.doubleValue())));
    }
    

    @Test
    @Transactional
    public void getOnlineOrder() throws Exception {
        // Initialize the database
        onlineOrderRepository.saveAndFlush(onlineOrder);

        // Get the onlineOrder
        restOnlineOrderMockMvc.perform(get("/api/online-orders/{id}", onlineOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(onlineOrder.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER.toString()))
            .andExpect(jsonPath("$.totalPrice").value(DEFAULT_TOTAL_PRICE.doubleValue()));
    }
    @Test
    @Transactional
    public void getNonExistingOnlineOrder() throws Exception {
        // Get the onlineOrder
        restOnlineOrderMockMvc.perform(get("/api/online-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOnlineOrder() throws Exception {
        // Initialize the database
        onlineOrderRepository.saveAndFlush(onlineOrder);

        int databaseSizeBeforeUpdate = onlineOrderRepository.findAll().size();

        // Update the onlineOrder
        OnlineOrder updatedOnlineOrder = onlineOrderRepository.findById(onlineOrder.getId()).get();
        // Disconnect from session so that the updates on updatedOnlineOrder are not directly saved in db
        em.detach(updatedOnlineOrder);
        updatedOnlineOrder
            .address(UPDATED_ADDRESS)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .totalPrice(UPDATED_TOTAL_PRICE);

        restOnlineOrderMockMvc.perform(put("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOnlineOrder)))
            .andExpect(status().isOk());

        // Validate the OnlineOrder in the database
        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeUpdate);
        OnlineOrder testOnlineOrder = onlineOrderList.get(onlineOrderList.size() - 1);
        assertThat(testOnlineOrder.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testOnlineOrder.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testOnlineOrder.getTotalPrice()).isEqualTo(UPDATED_TOTAL_PRICE);
    }

    @Test
    @Transactional
    public void updateNonExistingOnlineOrder() throws Exception {
        int databaseSizeBeforeUpdate = onlineOrderRepository.findAll().size();

        // Create the OnlineOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restOnlineOrderMockMvc.perform(put("/api/online-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(onlineOrder)))
            .andExpect(status().isBadRequest());

        // Validate the OnlineOrder in the database
        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOnlineOrder() throws Exception {
        // Initialize the database
        onlineOrderRepository.saveAndFlush(onlineOrder);

        int databaseSizeBeforeDelete = onlineOrderRepository.findAll().size();

        // Get the onlineOrder
        restOnlineOrderMockMvc.perform(delete("/api/online-orders/{id}", onlineOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<OnlineOrder> onlineOrderList = onlineOrderRepository.findAll();
        assertThat(onlineOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OnlineOrder.class);
        OnlineOrder onlineOrder1 = new OnlineOrder();
        onlineOrder1.setId(1L);
        OnlineOrder onlineOrder2 = new OnlineOrder();
        onlineOrder2.setId(onlineOrder1.getId());
        assertThat(onlineOrder1).isEqualTo(onlineOrder2);
        onlineOrder2.setId(2L);
        assertThat(onlineOrder1).isNotEqualTo(onlineOrder2);
        onlineOrder1.setId(null);
        assertThat(onlineOrder1).isNotEqualTo(onlineOrder2);
    }
}
